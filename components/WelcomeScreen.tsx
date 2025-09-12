import React, { useRef } from 'react';
import type { HistoryItem } from '../types';
import { HistoryList } from './HistoryList';

interface WelcomeScreenProps {
  onImageSelect: (file: File) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const BarcodeIcon = () => (
    <div className="relative w-60 h-60 bg-gradient-to-br from-brand-green to-teal-400 rounded-3xl flex items-center justify-center p-4 shadow-lg mb-8">
        <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-6"></div>
        <div className="grid grid-cols-8 gap-1.5 w-full h-full opacity-80">
            {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-white rounded-full" style={{gridColumn: `span ${Math.floor(Math.random() * 3) + 1}`}}></div>
            ))}
        </div>
        <span className="absolute bottom-5 text-white text-2xl font-bold drop-shadow-md tracking-wider">FoodLabel Scan</span>
    </div>
);


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageSelect, history, onClearHistory }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <>
      <div className="text-center pt-8 pb-24 flex flex-col items-center">
        <BarcodeIcon />
        
        <p className="text-base text-brand-subtext mb-12 max-w-sm mx-auto">
          拍下食品營養標籤，AI 將為您分析成分，揭示隱藏風險。
        </p>

        <div className="w-full px-4 fixed bottom-12 left-1/2 -translate-x-1/2 max-w-md z-10">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              capture="environment"
            />
            <button
              onClick={handleButtonClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-brand-green to-teal-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              SCAN
            </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-8 border-t border-gray-200/80 pt-6">
           <HistoryList history={history} onClear={onClearHistory} />
        </div>
      )}
    </>
  );
};