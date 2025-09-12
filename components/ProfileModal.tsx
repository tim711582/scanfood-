import React from 'react';
import type { HistoryItem } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-brand-surface w-full max-w-md rounded-3xl shadow-2xl p-6 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-text">個人資料</h2>
          <button
            onClick={onClose}
            className="text-brand-subtext hover:text-brand-text transition-colors"
            aria-label="關閉個人資料"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-text">訪客使用者</p>
            <p className="text-sm text-brand-subtext">example@email.com</p>
          </div>
        </div>

        {/* Subscription & History */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-brand-bg rounded-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-brand-subtext font-medium">訂閱方案</p>
              <p className="font-bold text-brand-text">免費方案</p>
            </div>
            <button className="px-4 py-2 text-sm font-semibold text-brand-green-dark bg-brand-green-light rounded-full hover:opacity-90 transition">
              管理訂閱
            </button>
          </div>
          <div className="p-4 bg-brand-bg rounded-xl">
            <p className="text-xs text-brand-subtext font-medium">分析紀錄</p>
            <p className="font-bold text-brand-text">{history.length} 次掃描</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full text-center py-3 text-brand-subtext font-medium rounded-lg hover:bg-gray-100 transition-colors">
            帳號設定
          </button>
          <button className="w-full text-center py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
            登出
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-scale {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    `}</style>
    </div>
  );
};