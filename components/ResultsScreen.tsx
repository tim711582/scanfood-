import React, { useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { HealthScore } from './HealthScore';
import { AdditiveCard } from './AdditiveCard';
import { BeneficialCard } from './BeneficialCard';
import { getDeductionForCategory } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  result: AnalysisResult;
  image: string;
  imageFile: File;
  onReset: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, image, imageFile, onReset }) => {
  const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false);

  useEffect(() => {
    if (result.healthScore === 100) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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

  const handleShare = async () => {
    const shareText = `我用「營養標籤分析器」分析了「${result.productName}」，健康分數是 ${result.healthScore} 分！\n\nAI 總結：${result.summary}\n\n你也來試試看吧！`;

    const extension = imageFile.type.split('/')[1] || 'png';
    const sanitizedProductName = result.productName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_.-]/g, '_');
    const newFileName = `營養分析_${sanitizedProductName}.${extension}`;
    
    const fileToShare = new File([imageFile], newFileName, {
      type: imageFile.type,
      lastModified: imageFile.lastModified,
    });

    const shareData = {
      title: `「${result.productName}」的營養分析結果`,
      text: shareText,
      files: [fileToShare],
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Web Share API 錯誤:', error);
        }
      }
    } else {
      const encodedText = encodeURIComponent(shareText);
      const lineUrl = `https://line.me/R/msg/text/?${encodedText}`;
      window.open(lineUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const scoreColorClasses: Record<string, string> = {
    '20': 'text-red-600',
    '15': 'text-yellow-600',
    '10': 'text-yellow-600',
    '5': 'text-emerald-600',
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
          <img src={image} alt="Scanned nutrition label" className="rounded-lg shadow-md w-full object-contain max-h-60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{result.productName}</h2>
      </div>
      
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="flex flex-col items-center text-center">
            <HealthScore score={result.healthScore} />
            <p className="mt-4 text-base text-gray-700">{result.summary}</p>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <button 
              onClick={() => setIsScoreDetailsOpen(!isScoreDetailsOpen)}
              className="w-full flex justify-between items-center text-left text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
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
              <div id="score-details" className="mt-3 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between items-center py-1">
                      <span>基礎分數</span>
                      <span className="font-semibold text-gray-800">100</span>
                  </div>
                  {result.additives.map((additive, index) => {
                    const deduction = getDeductionForCategory(additive.category);
                    if (deduction === 0) return null;
                    const colorClass = scoreColorClasses[deduction.toString()] || 'text-gray-600';
                    return (
                       <div key={index} className={`flex justify-between items-center py-1 ${colorClass}`}>
                           <span>{additive.name} ({additive.category})</span>
                           <span className="font-semibold">{`-${deduction}`}</span>
                       </div>
                    )
                  })}

                  {result.beneficials.length > 0 && (
                      <div className="flex justify-between items-center py-1 text-green-600">
                          <span>有益成分 ({result.beneficials.length} 項)</span>
                          <span className="font-semibold">{`+${result.beneficials.length * 5}`}</span>
                      </div>
                  )}
                  <div className="border-t border-slate-200 !mt-2 pt-2"></div>
                  <div className="flex justify-between text-base font-bold text-gray-900">
                      <span>最終分數</span>
                      <span>{result.healthScore}</span>
                  </div>
              </div>
          )}
        </div>
      </div>
      
      {result.healthScore < 30 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
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
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
          <div className="text-center py-6 px-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-base font-medium text-green-800">
              {result.healthScore === 100 ? '太棒了！未發現任何需注意的人工添加劑！' : '好消息！未發現顯著的添加劑。'}
            </p>
          </div>
      )}

      <div className="pt-4 space-y-3">
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 11a9 9 0 0114.65-4.65l-2.12 2.12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13a9 9 0 01-14.65 4.65l2.12-2.12" />
            </svg>
            掃描其他產品
          </button>
          <button
            onClick={handleShare}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              分享結果
          </button>
      </div>
    </div>
  );
};