
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
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">營養標籤分析器</h1>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
           {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>由 AI 驅動。醫療建議請務必諮詢專業醫療人員。</p>
      </footer>
    </div>
  );
};

export default App;
