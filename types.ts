export interface GlobalConfig {
  hRef: number;
  cRef: number;
  me: number;
  ti: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  defaultHours: number;
  currentHours: number;
  isSelected: boolean;
  isCustom: boolean;
}

export interface CalculationResult {
  totalHours: number;
  costPerHour: number;
  grossCost: number;
  marginValue: number;
  valueWithMargin: number;
  taxValue: number;
  finalPrice: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  config: GlobalConfig;
  services: { name: string; hours: number }[];
  results: CalculationResult;
}
