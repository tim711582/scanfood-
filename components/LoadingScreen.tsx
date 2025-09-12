import React, { useState, useEffect } from 'react';

const messages = [
    "正在分析成分...",
    "正在掃描添加劑和防腐劑...",
    "正在檢查人工色素...",
    "正在計算健康分數...",
    "正在完成您的報告..."
];

const ScannerAnimation = () => (
    <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-brand-green/20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-green/30 animate-pulse [animation-delay:-0.5s]"></div>

        {/* Static Reticle */}
        <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-brand-green/10"></div>
        <div className="absolute w-[60%] h-[60%] rounded-full border border-brand-green/20"></div>
        
        {/* Central Lens */}
        <div className="w-20 h-20 rounded-full bg-gray-900/50 backdrop-blur-sm border-2 border-brand-green/30 flex items-center justify-center shadow-2xl shadow-brand-green/20">
            <div className="w-8 h-8 rounded-full bg-brand-green opacity-50 blur-lg animate-pulse [animation-delay:-1s]"></div>
            <div className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-white/80 to-slate-300/80"></div>
        </div>
    </div>
);

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <ScannerAnimation />
            <h2 className="text-2xl font-bold text-brand-text">請稍候</h2>
            <p className="text-brand-subtext mt-2 transition-opacity duration-500">{messages[messageIndex]}</p>
        </div>
    );
};