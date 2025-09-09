import React, { useState } from 'react';
import type { Additive } from '../types';
import { getDeductionForCategory } from '../services/geminiService';

interface AdditiveCardProps {
  additive: Additive;
}

type RiskLevel = 'Low' | 'Medium' | 'High';

const RiskIcon: React.FC<{ riskLevel: RiskLevel; className?: string }> = ({ riskLevel, className = "h-5 w-5" }) => {
    switch (riskLevel) {
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

export const AdditiveCard: React.FC<AdditiveCardProps> = ({ additive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `additive-details-${additive.name.replace(/\s+/g, '-')}`;

  const riskStyles = {
    Low: {
        header: 'bg-emerald-50 hover:bg-emerald-100',
        border: 'border-emerald-200',
        title: 'text-emerald-900',
        icon: 'text-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
    },
    Medium: {
        header: 'bg-yellow-50 hover:bg-yellow-100',
        border: 'border-yellow-200',
        title: 'text-yellow-900',
        icon: 'text-yellow-500',
        badge: 'bg-yellow-100 text-yellow-800',
    },
    High: {
        header: 'bg-red-50 hover:bg-red-100',
        border: 'border-red-200',
        title: 'text-red-900',
        icon: 'text-red-500',
        badge: 'bg-red-100 text-red-800',
    },
  };

  const getRiskInfo = (category: string): { riskLevel: RiskLevel; style: typeof riskStyles[RiskLevel] } => {
    const deduction = getDeductionForCategory(category);
    if (deduction >= 20) return { riskLevel: 'High', style: riskStyles.High };
    if (deduction >= 10) return { riskLevel: 'Medium', style: riskStyles.Medium };
    return { riskLevel: 'Low', style: riskStyles.Low };
  };
  
  const { riskLevel, style: currentStyle } = getRiskInfo(additive.category);

  return (
    <div className={`border ${currentStyle.border} rounded-lg shadow-sm overflow-hidden`}>
      <button
        className={`w-full flex justify-between items-center p-3 text-left transition-colors duration-200 ${currentStyle.header}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
      >
        <div className='flex items-center'>
            <RiskIcon riskLevel={riskLevel} className={`h-6 w-6 mr-3 ${currentStyle.icon}`} />
            <span className={`text-base font-semibold ${currentStyle.title}`}>{additive.name}</span>
        </div>
        <div className='flex items-center space-x-3'>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${currentStyle.badge}`}>
              {additive.category}
            </span>
            <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
      </button>
      {isOpen && (
        <div id={detailsId} className="px-4 pb-4 pt-3 border-t bg-white space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">描述</h4>
            <p className="text-gray-600">{additive.description}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
              潛在危害
            </h4>
            <p className="text-gray-600">{additive.potentialHarm}</p>
          </div>
        </div>
      )}
    </div>
  );
};