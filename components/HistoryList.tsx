import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
}

const getScoreColor = (s: number) => {
    if (s >= 75) return 'bg-brand-green-light text-brand-green-dark';
    if (s >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-brand-text">分析紀錄</h3>
        <button
          onClick={onClear}
          className="text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
          aria-label="清除所有紀錄"
        >
          清除所有紀錄
        </button>
      </div>
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-text truncate">{item.productName}</p>
                <p className="text-sm text-brand-subtext truncate">{item.summary}</p>
                 <p className="text-xs text-gray-400 mt-1.5">
                  {new Date(item.timestamp).toLocaleString('zh-TW', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
              <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-xl ${getScoreColor(item.healthScore)}`}>
                <span>{item.healthScore}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};