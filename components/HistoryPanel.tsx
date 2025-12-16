import React from 'react';
import { HistoryItem } from '../types';
import { History, Trash2, Calendar } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onLoadHistoryItem?: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">Histórico de Cálculos</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Limpar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {history.map((item) => (
          <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-indigo-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-1 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-100">
                <Calendar className="w-3 h-3" />
                {item.dateStr}
              </div>
              <span className="text-xs font-mono text-slate-400">#{item.id.slice(-4)}</span>
            </div>

            <div className="space-y-1 mb-3">
                <div className="text-sm text-slate-700">
                    <span className="font-medium">{item.services.length}</span> Serviços
                    <span className="mx-1 text-slate-300">|</span>
                    <span className="font-medium">{item.results.totalHours}h</span> Totais
                </div>
                <div className="flex flex-wrap gap-1">
                    {item.services.slice(0, 3).map((svc, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 truncate max-w-[100px]">
                            {svc.name}
                        </span>
                    ))}
                    {item.services.length > 3 && (
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                            +{item.services.length - 3}
                        </span>
                    )}
                </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                <div className="flex flex-col text-xs text-slate-500">
                   <span>Margem: {item.config.me}%</span>
                   <span>Imposto: {item.config.ti}%</span>
                </div>
              <span className="text-lg font-bold text-indigo-700">
                {formatCurrency(item.results.finalPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};