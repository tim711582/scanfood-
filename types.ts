
export type Additive = {
  name: string;
  category: string; // e.g., '人工甜味劑', '防腐劑'
  description: string;
  potentialHarm: string;
};

export type Beneficial = {
  name: string;
  description: string;
  benefits: string;
};

export type AnalysisResult = {
  productName: string;
  healthScore: number;
  summary: string;
  additives: Additive[];
  beneficials: Beneficial[];
};

export type AppState = 'welcome' | 'loading' | 'results' | 'error';