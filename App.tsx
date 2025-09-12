import React, { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { ProfileModal } from './components/ProfileModal';
import { analyzeNutritionLabel } from './services/geminiService';
import { getHistory, saveAnalysisToHistory, clearHistory } from './services/historyService';
import type { AppState, AnalysisResult, HistoryItem } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

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
  
  const handleSaveHistory = (result: AnalysisResult) => {
    const updatedHistory = saveAnalysisToHistory(result);
    setHistory(updatedHistory);
  };
  
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };
  
  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return analysisResult && uploadedImage && (
          <ResultsScreen 
            result={analysisResult} 
            image={uploadedImage} 
            onReset={handleReset} 
            onSave={handleSaveHistory}
            history={history}
          />
        );
      case 'error':
        return <ErrorScreen message={error || "發生了意外的錯誤。"} onReset={handleReset} />;
      case 'welcome':
      default:
        return <WelcomeScreen onImageSelect={handleImageAnalysis} history={history} onClearHistory={handleClearHistory} />;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-brand-text">
       <header className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">營養標籤掃雷</h1>
            <p className="text-sm text-brand-subtext">掃描與發現</p>
          </div>
          <button 
            onClick={handleOpenProfile}
            className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white" aria-label="使用者個人資料">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-brand-surface/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl shadow-lg transition-all duration-300">
           {renderContent()}
        </div>
      </main>

      <footer className="text-center py-4 text-brand-subtext text-xs px-4">
        <p>由 AI 驅動。醫療建議請務必諮詢專業醫療人員。</p>
      </footer>
      
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfile}
        history={history}
      />
    </div>
  );
};

export default App;