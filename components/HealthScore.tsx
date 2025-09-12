import React, { useState, useEffect } from 'react';

interface HealthScoreProps {
  score: number;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-brand-green';
    if (s >= 40) return 'text-brand-yellow';
    return 'text-brand-red';
  };

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const animationDuration = 1200; // milliseconds

    const animateScore = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentAnimatedScore = Math.round(easedProgress * score);
      setDisplayScore(currentAnimatedScore);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateScore);
      }
    };

    animationFrameId = requestAnimationFrame(animateScore);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score]);

  const colorClass = getScoreColor(score);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-500/10"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r="44"
          cx="50"
          cy="50"
        />
        <circle
          className={colorClass}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="44"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${colorClass}`}>{displayScore}</span>
        <span className="text-xs font-medium text-brand-subtext tracking-wide">健康分數</span>
      </div>
    </div>
  );
};