import React, { useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { HealthScore } from './HealthScore';
import { AdditiveCard } from './AdditiveCard';
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

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [result.healthScore]);

  const handleLineShare = () => {
    const shareText = `我用「營養標籤分析器」分析了一項食品，健康分數是 ${result.healthScore} 分！\n\nAI 總結：${result.summary}\n\n你也來試試看吧！`;
    const encodedText = encodeURIComponent(shareText);
    const lineUrl = `https://line.me/R/msg/text/?${encodedText}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <img src={image} alt="Scanned nutrition label" className="rounded-lg shadow-md w-full object-contain max-h-80" />
        </div>
        <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
          <HealthScore score={result.healthScore} />
          <p className="mt-4 text-lg text-gray-700">{result.summary}</p>
        </div>
      </div>
      
      {result.healthScore < 30 && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v8a1 1 0 01-2 0V4zm0 12a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-red-800">食用警告</h3>
              <div className="mt-1 text-md text-red-700">
                <p>此產品的健康分數極低。基於分析出的成分，強烈建議您**避免食用**此產品。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          已識別的添加劑
        </h3>
        {result.additives.length > 0 ? (
          <div className="space-y-4">
            {result.additives.map((additive, index) => (
              <AdditiveCard key={index} additive={additive} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-lg font-medium text-green-800">
              {result.healthScore === 100 ? '太棒了！這是一款純天然產品！' : '好消息！未發現顯著的添加劑。'}
            </p>
          </div>
        )}
      </div>

      <div className="text-center pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              掃描其他產品
            </button>
            <button
              onClick={handleLineShare}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#06C755] hover:bg-[#05a546] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C755]"
            >
                <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8.5 13.5h-2v-5h2v5zm4.5 0h-2v-5h2v5zm4.5 0h-2v-5h2v5z"></path>
                </svg>
                用 LINE 分享
            </button>
        </div>
      </div>
    </div>
  );
};
