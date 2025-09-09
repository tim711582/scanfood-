
import React, { useRef } from 'react';

interface WelcomeScreenProps {
  onImageSelect: (file: File) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageSelect }) => {
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
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-emerald-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">了解您的食物</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        拍下任何食品的營養標籤，我們的人工智慧將分析其成分中的添加劑，解釋風險，並給出健康評分。
      </p>
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
        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        掃描營養標籤
      </button>
    </div>
  );
};
