
import React from 'react';

interface ErrorScreenProps {
  message: string;
  onReset: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onReset }) => {
  return (
    <div className="text-center p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-lg">
       <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-red-800 mb-2">分析失敗</h2>
      <p className="text-red-700 mb-6">{message}</p>
      <button
        onClick={onReset}
        className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        再試一次
      </button>
    </div>
  );
};
