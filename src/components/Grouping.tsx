import { useState } from 'react';
import { LayoutGrid, Users, Shuffle, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function Grouping({ names }: { names: string[] }) {
  const [groupMode, setGroupMode] = useState<'numGroups' | 'numPerGroup'>('numGroups');
  const [groupValue, setGroupValue] = useState<number>(2);
  const [groups, setGroups] = useState<string[][]>([]);

  const generateGroups = () => {
    if (names.length === 0) {
      alert("Please add participants first!");
      return;
    }

    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const result: string[][] = [];
    
    if (groupMode === 'numGroups') {
      const numGroups = Math.max(1, Math.min(groupValue, names.length));
      for (let i = 0; i < numGroups; i++) {
        result.push([]);
      }
      shuffled.forEach((name, index) => {
        result[index % numGroups].push(name);
      });
    } else {
      const size = Math.max(1, groupValue);
      for (let i = 0; i < shuffled.length; i += size) {
        result.push(shuffled.slice(i, i + size));
      }
    }

    setGroups(result);
  };

  const downloadCSV = () => {
    let csvContent = "Group,Name\n";
    groups.forEach((group, index) => {
      group.forEach(member => {
        const escapedMember = member.includes(',') || member.includes('"') 
          ? `"${member.replace(/"/g, '""')}"` 
          : member;
        csvContent += `Group ${index + 1},${escapedMember}\n`;
      });
    });
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "groups.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Automatic Grouping</h2>
        <p className="text-slate-500 mt-2">Randomly divide participants into teams or groups.</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-end gap-6">
        <div className="w-full md:w-auto flex-1 space-y-2">
          <label className="text-sm font-semibold text-slate-700">Grouping Method</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setGroupMode('numGroups')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${groupMode === 'numGroups' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Number of Groups
            </button>
            <button
              onClick={() => setGroupMode('numPerGroup')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${groupMode === 'numPerGroup' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              People per Group
            </button>
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {groupMode === 'numGroups' ? 'How many groups?' : 'How many people?'}
          </label>
          <input
            type="number"
            min="1"
            max={names.length || 100}
            value={groupValue}
            onChange={(e) => setGroupValue(parseInt(e.target.value) || 1)}
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <button
          onClick={generateGroups}
          disabled={names.length === 0}
          className="w-full md:w-auto py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 h-[46px]"
        >
          <Shuffle size={18} />
          Generate
        </button>
      </div>

      {/* Results */}
      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-800">Results ({groups.length} Groups)</h3>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors text-sm shadow-sm"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Group {index + 1}</span>
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Users size={12} />
                    {group.length}
                  </span>
                </div>
                <div className="p-5 flex-1">
                  <ul className="space-y-2">
                    {group.map((member, mIndex) => (
                      <li key={mIndex} className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        <span className="font-medium">{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {groups.length === 0 && names.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-slate-400">
          <LayoutGrid size={48} className="opacity-20 mb-4" />
          <p>Configure your settings and click Generate to see groups.</p>
        </div>
      )}
    </div>
  );
}
