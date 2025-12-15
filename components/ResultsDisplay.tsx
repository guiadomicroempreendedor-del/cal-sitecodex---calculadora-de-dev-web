import React from 'react';
import { CalculationResult } from '../types';
import { Calculator, Save } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsDisplayProps {
  results: CalculationResult;
  onSaveHistory: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onSaveHistory }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatNumber = (val: number) => 
    new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(val);

  // Data for Chart
  const chartData = [
    { name: 'Custo Bruto (Mão de Obra)', value: results.grossCost },
    { name: 'Margem (Gordura)', value: results.marginValue },
    { name: 'Impostos', value: results.taxValue },
  ].filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden sticky top-6">
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold">Resumo do Orçamento</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-600 font-medium">Total Horas</span>
            <span className="text-lg font-bold text-slate-800">{formatNumber(results.totalHours)}h</span>
          </div>

          <div className="flex justify-between items-center px-3">
            <span className="text-sm text-slate-500">Custo Bruto</span>
            <span className="font-medium text-slate-700">{formatCurrency(results.grossCost)}</span>
          </div>

          <div className="flex justify-between items-center px-3">
            <span className="text-sm text-slate-500">+ Margem</span>
            <span className="font-medium text-emerald-600">+{formatCurrency(results.marginValue)}</span>
          </div>

           <div className="flex justify-between items-center px-3 border-b border-slate-100 pb-3">
            <span className="text-sm text-slate-500">+ Impostos</span>
            <span className="font-medium text-rose-500">+{formatCurrency(results.taxValue)}</span>
          </div>

          <div className="flex justify-between items-end pt-2">
            <span className="text-slate-800 font-bold text-lg">Preço Final</span>
            <span className="text-3xl font-bold text-indigo-600">{formatCurrency(results.finalPrice)}</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="h-48 mt-6 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={onSaveHistory}
          disabled={results.totalHours === 0}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <Save className="w-5 h-5" />
          Salvar no Histórico
        </button>
      </div>
    </div>
  );
};
