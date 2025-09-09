
import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { analyzeNutritionLabel } from './services/geminiService';
import type { AppState, AnalysisResult } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageAnalysis = useCallback(async (file: File) => {
    setAppState('loading');
    setUploadedImage(URL.createObjectURL(file));
    setError(null);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(',')[1];
          const result = await analyzeNutritionLabel(base64Image, file.type);
          setAnalysisResult(result);
          setAppState('results');
        } catch (err) {
          console.error("Analysis failed:", err);
          setError(err instanceof Error ? err.message : "分析過程中發生未知錯誤。");
          setAppState('error');
        }
      };
      reader.onerror = () => {
        throw new Error("讀取圖片檔案失敗。");
      };
    } catch (err) {
      console.error("Image processing failed:", err);
      setError(err instanceof Error ? err.message : "處理圖片時發生未知錯誤。");
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('welcome');
    setAnalysisResult(null);
    setError(null);
    if(uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
        setUploadedImage(null);
    }
  }, [uploadedImage]);
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return analysisResult && uploadedImage && <ResultsScreen result={analysisResult} image={uploadedImage} onReset={handleReset} />;
      case 'error':
        return <ErrorScreen message={error || "發生了意外的錯誤。"} onReset={handleReset} />;
      case 'welcome':
      default:
        return <WelcomeScreen onImageSelect={handleImageAnalysis} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased">
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">營養標籤分析器</h1>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md transition-all duration-300">
           {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-xs px-4">
        <p>由 AI 驅動。醫療建議請務必諮詢專業醫療人員。</p>
      </footer>
    </div>
  );
};

export default App;