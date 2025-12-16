import React, { useState } from 'react';
import { CalculationResult, ServiceItem, GlobalConfig } from '../types';
import { Calculator, Save, Copy, Download, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsDisplayProps {
  results: CalculationResult;
  services: ServiceItem[];
  config: GlobalConfig;
  onSaveHistory: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, services, config, onSaveHistory }) => {
  const [copied, setCopied] = useState(false);

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

  const generateSummaryText = () => {
    const activeServices = services.filter(s => s.isSelected);
    const date = new Date().toLocaleString('pt-BR');
    
    let text = `📋 ORÇAMENTO ESTIMADO - Calc²\n`;
    text += `Data: ${date}\n`;
    text += `--------------------------------\n\n`;
    
    text += `SERVIÇOS SELECIONADOS:\n`;
    activeServices.forEach(s => {
      text += `• ${s.name}: ${formatNumber(s.currentHours)}h\n`;
    });
    
    text += `\nRESUMO FINANCEIRO:\n`;
    text += `Total de Horas: ${formatNumber(results.totalHours)}h\n`;
    text += `Custo Base: ${formatCurrency(results.grossCost)}\n`;
    text += `Margem (${config.me}%): +${formatCurrency(results.marginValue)}\n`;
    text += `Impostos (${config.ti}%): +${formatCurrency(results.taxValue)}\n`;
    text += `--------------------------------\n`;
    text += `💰 PREÇO FINAL: ${formatCurrency(results.finalPrice)}`;

    return text;
  };

  const handleCopy = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar', err);
    }
  };

  const handleDownload = () => {
    const text = generateSummaryText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orcamento_calc2_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <div className="w-full mt-6" style={{ height: 200 }}>
           <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                {chartData.map((_, index) => (
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

        <div className="space-y-3 mt-6">
          <button
            onClick={onSaveHistory}
            disabled={results.totalHours === 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            Salvar no Histórico
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              disabled={results.totalHours === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border ${
                copied 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-indigo-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            
            <button
              onClick={handleDownload}
              disabled={results.totalHours === 0}
              className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-200 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Baixar TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};