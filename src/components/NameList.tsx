import React, { useState, useRef } from 'react';
import { Upload, Trash2, FileText, Plus, Users, AlertTriangle, Wand2 } from 'lucide-react';

export default function NameList({ names, setNames }: { names: string[], setNames: (names: string[]) => void }) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNames = () => {
    const newNames = inputText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    setNames([...names, ...newNames]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedNames = text
        .split(/[\n,]+/)
        .map(n => n.trim().replace(/^["']|["']$/g, ''))
        .filter(n => n.length > 0);
      
      if (parsedNames.length > 0) {
        setTimeout(() => alert(`成功匯入 ${parsedNames.length} 筆資料！`), 100);
      }
      setNames([...names, ...parsedNames]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (window.confirm('確定要清空所有名單嗎？')) {
      setNames([]);
    }
  };

  const loadMockData = () => {
    const mockNames = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 
      'Evan Wright', 'Fiona Gallagher', 'George Costanza', 'Hannah Abbott', 
      'Ian Malcolm', 'Julia Roberts', 'Kevin Bacon', 'Laura Dern', 
      'Alice Johnson', 'Bob Smith' // Intentional duplicates
    ];
    setNames([...names, ...mockNames]);
  };

  const nameCounts = names.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasDuplicates = Object.values(nameCounts).some(count => count > 1);

  const removeDuplicates = () => {
    setNames(Array.from(new Set(names)));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Name List</h2>
        <p className="text-slate-500 mt-2">Add participants for the prize draw or grouping.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            Paste Names
          </h3>
          <textarea
            className="w-full h-48 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="John Doe&#10;Jane Smith&#10;Alice Johnson..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddNames}
            disabled={!inputText.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Names
          </button>

          <button
            onClick={loadMockData}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Wand2 size={16} />
            Load Mock Data
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div>
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-white border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Upload CSV / TXT
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users size={20} className="text-emerald-500" />
              Participants ({names.length})
            </h3>
            <div className="flex items-center gap-2">
              {hasDuplicates && (
                <button
                  onClick={removeDuplicates}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-1"
                >
                  <AlertTriangle size={14} />
                  Remove Duplicates
                </button>
              )}
              {names.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Users size={48} className="opacity-20" />
                <p>No participants added yet.</p>
              </div>
            ) : (
              names.map((name, index) => {
                const isDuplicate = nameCounts[name] > 1;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-xl group transition-colors ${isDuplicate ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`font-medium truncate ${isDuplicate ? 'text-amber-800' : 'text-slate-700'}`}>{name}</span>
                      {isDuplicate && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-md">Duplicate</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeName(index)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
