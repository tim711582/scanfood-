import React, { useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { HealthScore } from './HealthScore';
import { AdditiveCard } from './AdditiveCard';
import { BeneficialCard } from './BeneficialCard';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, image, onReset }) => {
  
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

  const handleLineShare = () => {
    const shareText = `我用「營養標籤分析器」分析了一項食品，健康分數是 ${result.healthScore} 分！\n\nAI 總結：${result.summary}\n\n你也來試試看吧！`;
    const encodedText = encodeURIComponent(shareText);
    const lineUrl = `https://line.me/R/msg/text/?${encodedText}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
          <img src={image} alt="Scanned nutrition label" className="rounded-lg shadow-md w-full object-contain max-h-60 mx-auto" />
      </div>
      
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="flex flex-col items-center text-center">
            <HealthScore score={result.healthScore} />
            <p className="mt-4 text-base text-gray-700">{result.summary}</p>
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
            onClick={handleLineShare}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
              <svg className="w-5 h-5 mr-2 text-[#06C755]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.2,3.8C19,2.6,17.4,2,15.7,2H8.3C4.8,2,2,4.8,2,8.3v7.4c0,3.5,2.8,6.3,6.3,6.3h1.8c0.2,0,0.4,0.1,0.5,0.2l2.3,2 c0.3,0.3,0.8,0.3,1.1,0l2.3-2c0.1-0.1,0.3-0.2,0.5-0.2h1.8c3.5,0,6.3-2.8,6.3-6.3V8.3C22,6.6,21.4,5,20.2,3.8z M8,13.5 c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v3C9,13.1,8.6,13.5,8,13.5z M12,13.5c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1 s1,0.4,1,1v3C13,13.1,12.6,13.5,12,13.5z M16,13.5c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v3C17,13.1,16.6,13.5,16,13.5 z"></path>
              </svg>
              用 LINE 分享
          </button>
      </div>
    </div>
  );
};