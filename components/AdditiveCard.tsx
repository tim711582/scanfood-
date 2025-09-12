import React, { useState } from 'react';
import type { Additive } from '../types';
import { getDeductionForCategory } from '../services/geminiService';

interface AdditiveCardProps {
  additive: Additive;
}

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Carcinogenic';

const RiskIcon: React.FC<{ riskLevel: RiskLevel; className?: string }> = ({ riskLevel, className = "h-5 w-5" }) => {
    switch (riskLevel) {
        case 'Carcinogenic': // Fallback icon, but SkullIcon should be used.
             return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
             )
        case 'Low':
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'Medium':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'High':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        default:
            return null;
    }
}

const SkullIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.023 9.21a.75.75 0 01.75-.75h8.454a.75.75 0 010 1.5H5.773a.75.75 0 01-.75-.75zM10 14a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" />
      <path d="M5.138 11.233a.75.75 0 01.53.22l1.9 1.9a.75.75 0 01-1.06 1.06l-1.9-1.9a.75.75 0 01.53-1.28zm9.724 0a.75.75 0 01.53 1.28l-1.9 1.9a.75.75 0 11-1.06-1.06l1.9-1.9a.75.75 0 01.53-.22z" />
    </svg>
);


export const AdditiveCard: React.FC<AdditiveCardProps> = ({ additive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `additive-details-${additive.name.replace(/\s+/g, '-')}`;

  const riskStyles = {
     Carcinogenic: {
        header: 'bg-red-700/20 hover:bg-red-700/30',
        border: 'border-red-700/50',
        title: 'text-red-900 font-bold',
        icon: 'text-red-800',
        badge: 'bg-red-700/20 text-red-900',
    },
    Low: {
        header: 'bg-green-500/10 hover:bg-green-500/20',
        border: 'border-brand-green/30',
        title: 'text-green-900',
        icon: 'text-brand-green',
        badge: 'bg-green-500/20 text-green-800',
    },
    Medium: {
        header: 'bg-yellow-500/10 hover:bg-yellow-500/20',
        border: 'border-brand-yellow/30',
        title: 'text-yellow-900',
        icon: 'text-brand-yellow',
        badge: 'bg-yellow-500/20 text-yellow-800',
    },
    High: {
        header: 'bg-red-500/10 hover:bg-red-500/20',
        border: 'border-brand-red/30',
        title: 'text-red-900',
        icon: 'text-brand-red',
        badge: 'bg-red-500/20 text-red-800',
    },
  };

  const getRiskInfo = (additive: Additive): { riskLevel: RiskLevel; style: typeof riskStyles[RiskLevel] } => {
    if (additive.isCarcinogenic) {
        return { riskLevel: 'Carcinogenic', style: riskStyles.Carcinogenic };
    }
    const deduction = getDeductionForCategory(additive.category);
    if (deduction >= 20) return { riskLevel: 'High', style: riskStyles.High };
    if (deduction >= 10) return { riskLevel: 'Medium', style: riskStyles.Medium };
    return { riskLevel: 'Low', style: riskStyles.Low };
  };
  
  const { riskLevel, style: currentStyle } = getRiskInfo(additive);

  return (
    <div className={`border ${currentStyle.border} rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm`}>
      <button
        className={`w-full flex justify-between items-center p-3 text-left transition-colors duration-200 ${currentStyle.header}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
      >
        <div className='flex items-center'>
            {additive.isCarcinogenic 
                ? <SkullIcon className={`h-6 w-6 mr-3 ${currentStyle.icon}`} /> 
                : <RiskIcon riskLevel={riskLevel} className={`h-6 w-6 mr-3 ${currentStyle.icon}`} />
            }
            <span className={`text-base font-semibold ${currentStyle.title}`}>{additive.name}</span>
        </div>
        <div className='flex items-center space-x-3'>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${currentStyle.badge}`}>
              {additive.isCarcinogenic ? '潛在致癌物' : additive.category}
            </span>
            <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
      </button>
      {isOpen && (
        <div id={detailsId} className="px-4 pb-4 pt-3 border-t bg-white/50 space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-brand-text/80 mb-1">描述</h4>
            <p className="text-brand-subtext">{additive.description}</p>
          </div>
          <div>
            <h4 className="font-semibold text-brand-text/80 mb-1 flex items-center">
              潛在危害
            </h4>
            <p className="text-brand-subtext">{additive.potentialHarm}</p>
          </div>
        </div>
      )}
    </div>
  );
};