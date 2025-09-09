
export type Additive = {
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  potentialHarm: string;
};

export type AnalysisResult = {
  healthScore: number;
  summary: string;
  additives: Additive[];
};

export type AppState = 'welcome' | 'loading' | 'results' | 'error';
