import React, { useState, useEffect, useMemo } from 'react';
import type { AnalysisResult, HistoryItem } from '../types';
import { HealthScore } from './HealthScore';
import { AdditiveCard } from './AdditiveCard';
import { BeneficialCard } from './BeneficialCard';
import { CarcinogenWarning } from './CarcinogenWarning';
import { getDeductionForCategory } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
  onSave: (result: AnalysisResult) => void;
  history: HistoryItem[];
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, image, onReset, onSave, history }) => {
  const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false);
  
  const hasCarcinogen = useMemo(() => result.additives.some(a => a.isCarcinogenic), [result]);
  const [showCarcinogenWarning, setShowCarcinogenWarning] = useState(hasCarcinogen);


  const isAlreadySaved = useMemo(() => 
    history.some(item => 
      item.productName === result.productName &&
      item.summary === result.summary &&
      item.healthScore === result.healthScore
    ), [history, result]);

  const [isSaved, setIsSaved] = useState(isAlreadySaved);

  useEffect(() => {
    if (result.healthScore === 100) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: number = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [result.healthScore]);

  const handleSave = () => {
    if (!isSaved) {
      onSave(result);
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    // 確保 Emoji 顯示在訊息的最開頭，以增加視覺吸引力
    const shareText = `${result.productEmoji}「${result.productName}」的分析結果：\n\n⭐ 健康分數：${result.healthScore} / 100\n\n📄 AI 總結：\n${result.summary}\n\n你也來試試「營養標籤掃雷」APP 吧！`;
    const encodedText = encodeURIComponent(shareText);
    const lineUrl = `https://line.me/R/msg/text/?${encodedText}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  const scoreColorClasses: Record<string, string> = {
    '30': 'text-brand-red font-bold',
    '20': 'text-brand-red',
    '15': 'text-brand-yellow',
    '10': 'text-brand-yellow',
    '5': 'text-brand-green',
  }

  return (
    <>
    <CarcinogenWarning isOpen={showCarcinogenWarning} onClose={() => setShowCarcinogenWarning(false)} />
    <div className="space-y-6">
      <div className="text-center">
          <img src={image} alt="Scanned nutrition label" className="rounded-2xl shadow-lg w-full object-contain max-h-60 mx-auto mb-4 border-4 border-white" />
          <h2 className="text-2xl font-bold text-brand-text">{result.productEmoji} {result.productName}</h2>
      </div>
      
      <div className="p-4 bg-brand-bg/60 rounded-2xl">
        <div className="flex flex-col items-center text-center">
            <HealthScore score={result.healthScore} />
            <p className="mt-4 text-base text-brand-text">{result.summary}</p>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <button 
              onClick={() => setIsScoreDetailsOpen(!isScoreDetailsOpen)}
              className="w-full flex justify-between items-center text-left text-sm font-medium text-brand-subtext hover:text-brand-text focus:outline-none"
              aria-expanded={isScoreDetailsOpen}
              aria-controls="score-details"
          >
              <span>分數計算詳情</span>
              <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${isScoreDetailsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
          </button>
          {isScoreDetailsOpen && (
              <div id="score-details" className="mt-3 text-sm text-brand-subtext space-y-1">
                  <div className="flex justify-between items-center py-1">
                      <span>基礎分數</span>
                      <span className="font-semibold text-brand-text">100</span>
                  </div>
                  {result.additives.map((additive, index) => {
                    const deduction = getDeductionForCategory(additive.category, additive.isCarcinogenic);
                    if (deduction === 0) return null;
                    const colorClass = scoreColorClasses[deduction.toString()] || 'text-brand-subtext';
                    return (
                       <div key={index} className={`flex justify-between items-center py-1 ${colorClass}`}>
                           <span>{additive.name} {additive.isCarcinogenic && '💀'}</span>
                           <span className="font-semibold">{`-${deduction}`}</span>
                       </div>
                    )
                  })}
                  <div className="border-t border-slate-200 !mt-2 pt-2"></div>
                  <div className="flex justify-between text-base font-bold text-brand-text">
                      <span>最終分數</span>
                      <span>{result.healthScore}</span>
                  </div>
              </div>
          )}
        </div>
      </div>
      
      {result.healthScore < 30 && (
        <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-brand-red/50 rounded-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-red" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-base font-semibold text-red-800">食用警告</h3>
              <p className="mt-1 text-sm text-red-700">此產品分數極低，基於其成分，強烈建議您**避免食用**。</p>
            </div>
          </div>
        </div>
      )}

      {result.additives.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-brand-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                需注意的添加劑
            </h3>
            <div className="space-y-3">
                {result.additives.map((additive, index) => (
                <AdditiveCard key={`additive-${index}-${additive.name}`} additive={additive} />
                ))}
            </div>
        </div>
      )}

      {result.beneficials && result.beneficials.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-brand-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                有益成分
            </h3>
            <div className="space-y-3">
                {result.beneficials.map((beneficial, index) => (
                <BeneficialCard key={`beneficial-${index}-${beneficial.name}`} beneficial={beneficial} />
                ))}
            </div>
        </div>
      )}

      {result.additives.length === 0 && (
          <div className="text-center py-6 px-4 bg-green-500/10 backdrop-blur-sm border border-brand-green/50 rounded-2xl">
            <p className="text-base font-medium text-brand-green-dark">
              {result.healthScore === 100 ? '太棒了！未發現任何需注意的人工添加劑！' : '好消息！未發現顯著的添加劑。'}
            </p>
          </div>
      )}

      <div className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className="w-full inline-flex items-center justify-center px-4 py-4 border border-transparent text-lg font-bold rounded-full shadow-md text-brand-green-dark bg-brand-green-light/50 hover:bg-brand-green-light/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all transform hover:scale-105"
              >
                {isSaved ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-green" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        已儲存
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        儲存
                    </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-full inline-flex items-center justify-center px-4 py-4 border border-transparent text-lg font-bold rounded-full shadow-md text-brand-green-dark bg-brand-green-light/50 hover:bg-brand-green-light/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all transform hover:scale-105"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  分享
              </button>
          </div>
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-brand-green to-teal-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all transform hover:scale-105"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 11a9 9 0 0114.65-4.65l-2.12 2.12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13a9 9 0 01-14.65 4.65l2.12-2.12" />
            </svg>
            掃描其他產品
          </button>
      </div>
    </div>
    </>
  );
};