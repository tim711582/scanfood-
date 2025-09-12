import React, { useState } from 'react';
import type { Beneficial } from '../types';

interface BeneficialCardProps {
  beneficial: Beneficial;
}

export const BeneficialCard: React.FC<BeneficialCardProps> = ({ beneficial }) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `beneficial-details-${beneficial.name.replace(/\s+/g, '-')}`;

  const style = {
    header: 'bg-green-500/10 hover:bg-green-500/20',
    border: 'border-brand-green/30',
    title: 'text-green-900',
    icon: 'text-brand-green',
  };

  return (
    <div className={`border ${style.border} rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm`}>
      <button
        className={`w-full flex justify-between items-center p-3 text-left transition-colors duration-200 ${style.header}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
      >
        <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-base font-semibold ${style.title}`}>{beneficial.name}</span>
        </div>
        <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div id={detailsId} className="px-4 pb-4 pt-3 border-t bg-white/50 space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-brand-text/80 mb-1">描述</h4>
            <p className="text-brand-subtext">{beneficial.description}</p>
          </div>
          <div>
            <h4 className="font-semibold text-brand-text/80 mb-1">健康益處</h4>
            <p className="text-brand-subtext">{beneficial.benefits}</p>
          </div>
        </div>
      )}
    </div>
  );
};