
import React from 'react';

interface HealthScoreProps {
  score: number;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = getScoreColor();

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-in-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-extrabold ${colorClass}`}>{score}</span>
        <span className="text-sm font-medium text-gray-500">健康分數</span>
      </div>
    </div>
  );
};
