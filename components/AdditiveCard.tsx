import React, { useState } from 'react';
import type { Additive } from '../types';

interface AdditiveCardProps {
  additive: Additive;
}

const RiskIcon: React.FC<{ riskLevel: Additive['riskLevel']; className?: string }> = ({ riskLevel, className = "h-5 w-5 mr-1.5" }) => {
    switch (riskLevel) {
        case 'Low':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        case 'Medium':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            );
        case 'High':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v8a1 1 0 01-2 0V4zm0 12a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
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
    Low: '低',
    Medium: '中',
    High: '高',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${riskStyles[riskLevel]}`}>
      <RiskIcon riskLevel={riskLevel} className="h-4 w-4 mr-1.5" />
      {riskTranslations[riskLevel]} 風險
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
    },
    Medium: {
        header: 'bg-yellow-50 hover:bg-yellow-100',
        border: 'border-yellow-200',
        title: 'text-yellow-900',
    },
    High: {
        header: 'bg-red-50 hover:bg-red-100',
        border: 'border-red-200',
        title: 'text-red-900',
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
        className={`w-full flex justify-between items-center p-4 text-left transition-colors duration-200 ${currentStyle.header}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
      >
        <span className={`text-lg font-semibold ${currentStyle.title}`}>{additive.name}</span>
        <div className='flex items-center space-x-4'>
            <RiskBadge riskLevel={additive.riskLevel} />
            <svg
                className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
      </button>
      {isOpen && (
        <div id={detailsId} className="px-4 pb-4 pt-4 border-t bg-white space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 text-base mb-1">描述：</h4>
            <p className="text-gray-600 text-sm">{additive.description}</p>
          </div>
           <div>
            <h4 className="font-semibold text-gray-700 text-base mb-1">風險說明：</h4>
            <p className="text-gray-600 text-sm">{getRiskExplanation(additive.riskLevel)}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 text-base mb-1 flex items-center">
             {additive.riskLevel === 'High' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
             )}
              潛在危害：
            </h4>
            <p className="text-gray-600 text-sm">{additive.potentialHarm}</p>
          </div>
        </div>
      )}
    </div>
  );
};