import { useState } from 'react';
import { Users, Gift, LayoutGrid } from 'lucide-react';
import NameList from './components/NameList';
import PrizeDraw from './components/PrizeDraw';
import Grouping from './components/Grouping';

export default function App() {
  const [activeTab, setActiveTab] = useState('names');
  const [names, setNames] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">HR Toolkit</h1>
          <p className="text-sm text-slate-500 mt-1">Manage events & teams</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('names')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'names' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            Name List
            {names.length > 0 && (
              <span className="ml-auto bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">
                {names.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'draw' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Gift size={20} />
            Prize Draw
          </button>
          <button 
            onClick={() => setActiveTab('grouping')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'grouping' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={20} />
            Grouping
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'names' && <NameList names={names} setNames={setNames} />}
          {activeTab === 'draw' && <PrizeDraw names={names} setNames={setNames} />}
          {activeTab === 'grouping' && <Grouping names={names} />}
        </div>
      </main>
    </div>
  );
}
