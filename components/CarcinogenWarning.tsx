import React, { useEffect, useState } from 'react';

interface CarcinogenWarningProps {
  isOpen: boolean;
  onClose: () => void;
}

// Base64 encoded WAV file for a simple, sharp alert sound.
const alertSound = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+'BvT19/AOC/C53Vf/V/d5vLgsa/2f7e/d5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n5rLAAA9/7i/n'

export const CarcinogenWarning: React.FC<CarcinogenWarningProps> = ({ isOpen, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            const audio = new Audio(alertSound);
            audio.play().catch(e => console.error("Audio playback failed:", e));

            const timer = setTimeout(() => {
                setShow(false);
                // Wait for fade-out animation to finish before calling onClose
                setTimeout(onClose, 300); 
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen && !show) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-modal="true"
        role="alertdialog"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-pulse-bg"></div>
        <div className="relative text-center text-white p-6 rounded-3xl animate-warning-pop">
          <div className="relative flex justify-center items-center w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping-slow opacity-75"></div>
            <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse-slow"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="relative w-20 h-20" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-lg">警告！</h2>
          <p className="text-lg font-medium drop-shadow">此產品含有潛在致癌物，請避免食用！</p>
        </div>
      </div>
      <style>{`
        @keyframes pulse-bg {
            0%, 100% { background-color: rgba(0, 0, 0, 0.6); }
            50% { background-color: rgba(50, 0, 0, 0.7); }
        }
        .animate-pulse-bg { animation: pulse-bg 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes warning-pop {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-warning-pop { animation: warning-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .animate-ping-slow { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-pulse-slow { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    `}</style>
    </>
  );
};