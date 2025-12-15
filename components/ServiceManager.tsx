import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Layers, Plus, Trash2, Clock } from 'lucide-react';

interface ServiceManagerProps {
  services: ServiceItem[];
  onToggleService: (id: string) => void;
  onUpdateHours: (id: string, hours: number) => void;
  onAddCustomService: (name: string, hours: number) => void;
  onRemoveCustomService: (id: string) => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onToggleService,
  onUpdateHours,
  onAddCustomService,
  onRemoveCustomService,
}) => {
  const [customName, setCustomName] = useState('');
  const [customHours, setCustomHours] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName && customHours) {
      onAddCustomService(customName, parseFloat(customHours));
      setCustomName('');
      setCustomHours('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <Layers className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Módulos de Serviço</h2>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Serviços Disponíveis</h3>
        <div className="grid gap-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                service.isSelected
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  id={`check-${service.id}`}
                  checked={service.isSelected}
                  onChange={() => onToggleService(service.id)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                />
                <label
                  htmlFor={`check-${service.id}`}
                  className={`font-medium cursor-pointer select-none ${
                    service.isSelected ? 'text-indigo-900' : 'text-slate-700'
                  }`}
                >
                  {service.name}
                </label>
              </div>

              <div className="flex items-center gap-3">
                {service.isSelected && (
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={service.currentHours}
                      onChange={(e) => onUpdateHours(service.id, parseFloat(e.target.value))}
                      className="w-16 text-right text-sm font-medium text-slate-700 outline-none"
                    />
                    <span className="text-xs text-slate-500 pr-1">h</span>
                  </div>
                )}
                {!service.isSelected && (
                  <span className="text-sm text-slate-400 px-3 py-1 bg-slate-50 rounded border border-slate-100">
                    {service.defaultHours}h (Padrão)
                  </span>
                )}
                
                {service.isCustom && (
                  <button
                    onClick={() => onRemoveCustomService(service.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remover serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Adicionar Serviço Personalizado</h3>
        <form onSubmit={handleAddCustom} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Descrição do Serviço (ex: Integração API)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="relative md:w-32">
            <input
              type="number"
              placeholder="Horas"
              min="0.5"
              step="0.5"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">h</span>
          </div>
          <button
            type="submit"
            disabled={!customName || !customHours}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};
