import { useState, useEffect, useRef } from 'react';
import { Gift, RotateCcw, Trophy, Settings2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function PrizeDraw({ names, setNames }: { names: string[], setNames: (names: string[]) => void }) {
  const [allowRepetition, setAllowRepetition] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  
  const animationRef = useRef<number | null>(null);

  const startDraw = () => {
    if (names.length === 0) {
      alert("Please add participants first!");
      return;
    }

    setIsDrawing(true);
    setCurrentName(null);

    let speed = 50;
    let ticks = 0;
    const maxTicks = 40;

    const tick = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setCurrentName(randomName);
      ticks++;

      if (ticks < maxTicks) {
        if (ticks > maxTicks * 0.7) {
          speed += 20;
        }
        animationRef.current = window.setTimeout(tick, speed);
      } else {
        finishDraw(randomName);
      }
    };

    tick();
  };

  const finishDraw = (winner: string) => {
    setIsDrawing(false);
    setCurrentName(winner);
    setWinners(prev => [winner, ...prev]);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
    });

    if (!allowRepetition) {
      setNames(names.filter(n => n !== winner));
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Prize Draw</h2>
          <p className="text-slate-500 mt-2">Randomly select winners from your participant list.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <Settings2 size={18} className="text-slate-400" />
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={allowRepetition}
                onChange={(e) => setAllowRepetition(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${allowRepetition ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRepetition ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="text-sm font-medium text-slate-700 select-none">Allow Repetition</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Draw Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl"></div>
          </div>

          <div className="z-10 w-full max-w-md flex flex-col items-center">
            <div className="h-32 w-full flex items-center justify-center mb-8">
              <AnimatePresence mode="wait">
                {currentName ? (
                  <motion.div
                    key={currentName}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`text-center ${isDrawing ? 'text-4xl text-slate-400' : 'text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500'}`}
                  >
                    {currentName}
                  </motion.div>
                ) : (
                  <div className="text-3xl text-slate-300 font-medium text-center">
                    Ready to draw!
                  </div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={startDraw}
              disabled={isDrawing || names.length === 0}
              className="group relative w-full sm:w-auto px-12 py-5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xl transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <Gift size={28} className={isDrawing ? 'animate-bounce' : ''} />
              {isDrawing ? 'Drawing...' : 'Draw Winner'}
            </button>
            
            <p className="mt-6 text-sm text-slate-500 font-medium">
              {names.length} participants in the pool
            </p>
          </div>
        </div>

        {/* Winners List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Winners
            </h3>
            {winners.length > 0 && (
              <button
                onClick={() => setWinners([])}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {winners.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Trophy size={32} className="opacity-20" />
                <p className="text-sm">No winners yet.</p>
              </div>
            ) : (
              winners.map((winner, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${winner}-${index}`} 
                  className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {winners.length - index}
                  </div>
                  <span className="font-semibold text-slate-800 truncate">{winner}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
