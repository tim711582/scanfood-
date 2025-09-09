import React, { useState } from 'react';
import type { Additive } from '../types';

interface AdditiveCardProps {
  additive: Additive;
}

const RiskIcon: React.FC<{ riskLevel: Additive['riskLevel']; className?: string }> = ({ riskLevel, className = "h-5 w-5" }) => {
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


const RiskBadge: React.FC<{ riskLevel: Additive['riskLevel'] }> = ({ riskLevel }) => {
  const riskStyles = {
    Low: 'bg-emerald-100 text-emerald-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };
  
  const riskTranslations: Record<Additive['riskLevel'], string> = {
    Low: '低風險',
    Medium: '中風險',
    High: '高風險',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskStyles[riskLevel]}`}>
      {riskTranslations[riskLevel]}
    </span>
  );
};

export const AdditiveCard: React.FC<AdditiveCardProps> = ({ additive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `additive-details-${additive.name.replace(/\s+/g, '-')}`;

  const riskStyles = {
    Low: {
        header: 'bg-emerald-50 hover:bg-emerald-100',
        border: 'border-emerald-200',
        title: 'text-emerald-900',
        icon: 'text-emerald-500',
    },
    Medium: {
        header: 'bg-yellow-50 hover:bg-yellow-100',
        border: 'border-yellow-200',
        title: 'text-yellow-900',
        icon: 'text-yellow-500',
    },
    High: {
        header: 'bg-red-50 hover:bg-red-100',
        border: 'border-red-200',
        title: 'text-red-900',
        icon: 'text-red-500',
    },
  };

  const getRiskExplanation = (riskLevel: Additive['riskLevel']): string => {
    switch (riskLevel) {
      case 'Low':
        return "此類添加劑在常規食用量下，通常被認為是安全的，且科學研究未顯示有重大的健康風險。";
      case 'Medium':
        return "此類添加劑存在一些爭議或潛在風險，特別是對於敏感族群或長期大量攝取的情況。建議適量食用。";
      case 'High':
        return "此類添加劑與多項健康問題有關，或在科學研究中顯示出顯著的負面影響。建議盡量避免攝取。";
      default:
        return "";
    }
  };

  const currentStyle = riskStyles[additive.riskLevel];

  return (
    <div className={`border ${currentStyle.border} rounded-lg shadow-sm overflow-hidden`}>
      <button
        className={`w-full flex justify-between items-center p-3 text-left transition-colors duration-200 ${currentStyle.header}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
      >
        <div className='flex items-center'>
            <RiskIcon riskLevel={additive.riskLevel} className={`h-6 w-6 mr-3 ${currentStyle.icon}`} />
            <span className={`text-base font-semibold ${currentStyle.title}`}>{additive.name}</span>
        </div>
        <div className='flex items-center space-x-3'>
            <RiskBadge riskLevel={additive.riskLevel} />
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
            <h4 className="font-semibold text-gray-700 mb-1">說明</h4>
            <p className="text-gray-600">{getRiskExplanation(additive.riskLevel)}</p>
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