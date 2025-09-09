
export type Additive = {
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  potentialHarm: string;
};

export type Beneficial = {
  name: string;
  description: string;
  benefits: string;
};

export type AnalysisResult = {
  healthScore: number;
  summary: string;
  additives: Additive[];
  beneficials: Beneficial[];
};

export type AppState = 'welcome' | 'loading' | 'results' | 'error';