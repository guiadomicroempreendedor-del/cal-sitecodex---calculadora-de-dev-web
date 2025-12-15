import React from 'react';
import { GlobalConfig } from '../types';
import { Save, Settings } from 'lucide-react';

interface ConfigFormProps {
  config: GlobalConfig;
  onConfigChange: (newConfig: GlobalConfig) => void;
  onSave: () => void;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ config, onConfigChange, onSave }) => {
  const handleChange = (field: keyof GlobalConfig, value: string) => {
    const numValue = parseFloat(value);
    onConfigChange({
      ...config,
      [field]: isNaN(numValue) ? 0 : numValue,
    });
  };

  const costPerHour = config.hRef > 0 ? config.cRef / config.hRef : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Configurações Globais</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* H_Ref */}
        <div className="space-y-2">
          <label htmlFor="h_ref" className="block text-sm font-medium text-slate-600">
            H_Ref (Horas Base)
          </label>
          <div className="relative">
            <input
              id="h_ref"
              type="number"
              min="0.1"
              step="0.5"
              value={config.hRef}
              onChange={(e) => handleChange('hRef', e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">h</span>
          </div>
        </div>

        {/* C_Ref */}
        <div className="space-y-2">
          <label htmlFor="c_ref" className="block text-sm font-medium text-slate-600">
            C_Ref (Custo Base)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">R$</span>
            <input
              id="c_ref"
              type="number"
              min="0"
              step="0.01"
              value={config.cRef}
              onChange={(e) => handleChange('cRef', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* M_E */}
        <div className="space-y-2">
          <label htmlFor="m_e" className="block text-sm font-medium text-slate-600">
            M_E (Margem Erro)
          </label>
          <div className="relative">
            <input
              id="m_e"
              type="number"
              min="0"
              step="1"
              value={config.me}
              onChange={(e) => handleChange('me', e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
          </div>
        </div>

        {/* T_I */}
        <div className="space-y-2">
          <label htmlFor="t_i" className="block text-sm font-medium text-slate-600">
            T_I (Impostos)
          </label>
          <div className="relative">
            <input
              id="t_i"
              type="number"
              min="0"
              step="1"
              value={config.ti}
              onChange={(e) => handleChange('ti', e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Custo/Hora Base Calculado ($C_H$):</span>
          <span className="text-xl font-bold text-slate-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(costPerHour)}
            <span className="text-sm text-slate-400 font-normal ml-1">/ hora</span>
          </span>
        </div>
        
        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};
