import React, { useState, useEffect, useMemo } from 'react';
import { GlobalConfig, ServiceItem, CalculationResult, HistoryItem } from './types';
import { DEFAULT_CONFIG, INITIAL_SERVICES, STORAGE_KEYS } from './constants';
import { ConfigForm } from './components/ConfigForm';
import { ServiceManager } from './components/ServiceManager';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // State: Configuration
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // State: Services
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);

  // State: History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Logic: Calculate Results
  const results = useMemo<CalculationResult>(() => {
    const activeServices = services.filter((s) => s.isSelected);
    const totalHours = activeServices.reduce((acc, curr) => acc + curr.currentHours, 0);
    
    // Protect against division by zero if config is empty
    const costPerHour = config.hRef > 0 ? config.cRef / config.hRef : 0;
    
    const grossCost = totalHours * costPerHour;
    
    // Add Margin
    const marginAmount = grossCost * (config.me / 100);
    const withMargin = grossCost + marginAmount;
    
    // Add Tax
    const taxAmount = withMargin * (config.ti / 100);
    const finalPrice = withMargin + taxAmount;

    return {
      totalHours,
      costPerHour,
      grossCost,
      marginValue: marginAmount,
      valueWithMargin: withMargin,
      taxValue: taxAmount,
      finalPrice,
    };
  }, [services, config]);

  // Handlers: Config
  const handleSaveConfig = () => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    alert('Configurações salvas com sucesso!');
  };

  // Handlers: Services
  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s))
    );
  };

  const updateServiceHours = (id: string, hours: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentHours: hours } : s))
    );
  };

  const addCustomService = (name: string, hours: number) => {
    const newService: ServiceItem = {
      id: `custom_${Date.now()}`,
      name,
      defaultHours: hours,
      currentHours: hours,
      isSelected: true,
      isCustom: true,
    };
    setServices((prev) => [...prev, newService]);
  };

  const removeCustomService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers: History
  const saveToHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleString('pt-BR'),
      config: { ...config },
      services: services
        .filter((s) => s.isSelected)
        .map((s) => ({ name: s.name, hours: s.currentHours })),
      results: { ...results },
    };

    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">Calc²</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">SiteCodex Internal Tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top: Global Config */}
        <ConfigForm 
          config={config} 
          onConfigChange={setConfig} 
          onSave={handleSaveConfig} 
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Services & History */}
          <div className="flex-1 min-w-0">
            <ServiceManager
              services={services}
              onToggleService={toggleService}
              onUpdateHours={updateServiceHours}
              onAddCustomService={addCustomService}
              onRemoveCustomService={removeCustomService}
            />
            
            <HistoryPanel 
              history={history} 
              onClearHistory={clearHistory} 
            />
          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:w-[400px] shrink-0">
            <ResultsDisplay 
              results={results}
              services={services}
              config={config}
              onSaveHistory={saveToHistory} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
