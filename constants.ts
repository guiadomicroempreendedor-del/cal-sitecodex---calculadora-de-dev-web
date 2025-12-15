import { GlobalConfig, ServiceItem } from './types';

export const DEFAULT_CONFIG: GlobalConfig = {
  hRef: 7,
  cRef: 150.00,
  me: 10,
  ti: 0,
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'servico_lp',
    name: 'Landing Page Simples',
    defaultHours: 8,
    currentHours: 8,
    isSelected: false,
    isCustom: false,
  },
  {
    id: 'servico_inst',
    name: 'Site Institucional (5 abas)',
    defaultHours: 15,
    currentHours: 15,
    isSelected: false,
    isCustom: false,
  },
  {
    id: 'servico_seo',
    name: 'SEO Básico On-Page',
    defaultHours: 3,
    currentHours: 3,
    isSelected: false,
    isCustom: false,
  },
  {
    id: 'servico_gmb',
    name: 'Google My Business',
    defaultHours: 7,
    currentHours: 7,
    isSelected: false,
    isCustom: false,
  },
  {
    id: 'servico_seo_adv',
    name: 'SEO Avançado',
    defaultHours: 7,
    currentHours: 7,
    isSelected: false,
    isCustom: false,
  },
  {
    id: 'servico_host_domain',
    name: 'Hospedagem e Domínio',
    defaultHours: 24,
    currentHours: 24,
    isSelected: false,
    isCustom: false,
  },
];

export const STORAGE_KEYS = {
  CONFIG: 'calc2_config',
  HISTORY: 'calc2_history',
};