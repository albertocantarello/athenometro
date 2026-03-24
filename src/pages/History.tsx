import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteEvaluation } from '../utils/storage';
import { getZoneColorClass } from '../utils/calculator';
import type { EvaluationData, ZoneType } from '../types';
import { Trash2, ExternalLink } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<EvaluationData[]>([]);
  const [filter, setFilter] = useState<ZoneType | 'Tutte'>('Tutte');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Vuoi davvero eliminare questo tema dalla cronologia?')) {
      deleteEvaluation(id);
      setHistory(getHistory());
    }
  };

  const handleOpen = (item: EvaluationData) => {
    navigate('/risultati', { state: { evaluationData: item } });
  };

  const filteredHistory = filter === 'Tutte' 
    ? history 
    : history.filter(h => h.zona === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cronologia Valutazioni</h1>
          <p className="text-gray-800 font-medium">Archivio storico dei temi analizzati.</p>
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
        >
          <option value="Tutte">Tutte le Zone</option>
          <option value="Verde">Zona Verde</option>
          <option value="Gialla">Zona Gialla</option>
          <option value="Rossa">Zona Rossa</option>
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-12 text-center">
          <p className="text-gray-800 font-medium">Nessuna valutazione trovata.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleOpen(item)}
              className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 flex items-center justify-between cursor-pointer hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-3 h-12 rounded-full hidden sm:block ${getZoneColorClass(item.zona)}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{item.titolo}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-700 mt-1 font-medium">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono font-bold border px-2 py-0.5 rounded bg-gray-50">SP: {item.sp}</span>
                    <span className="sm:hidden px-2 py-0.5 rounded-full bg-gray-200 font-bold text-gray-900">{item.zona}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-4">
                <button 
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Elimina"
                >
                  <Trash2 size={18} />
                </button>
                <div className="p-2 text-gray-400 group-hover:text-primary transition-colors">
                  <ExternalLink size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
