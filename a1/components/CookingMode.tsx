import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { useWakeLock } from '../hooks/useWakeLock';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingMode: React.FC<Props> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { requestWakeLock, releaseWakeLock, isLocked } = useWakeLock();

  useEffect(() => {
    requestWakeLock();
    return () => {
      releaseWakeLock();
    };
  }, [requestWakeLock, releaseWakeLock]);

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur">
        <div className="flex items-center gap-2">
            {/* Only show indicator if locked (screen staying on) */}
            <div className={`flex items-center gap-1.5 transition-opacity ${isLocked ? 'opacity-100' : 'opacity-40'}`}>
              <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className="text-xs text-gray-300">
                {isLocked ? '화면 켜짐 유지 중' : '요리 모드'}
              </span>
            </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white" aria-label="닫기">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-brand-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center p-6 space-y-6 overflow-y-auto">
        <div className="text-brand-400 font-bold text-lg">
          단계 {currentStep + 1} / {recipe.steps.length}
        </div>
        
        <div className="text-3xl md:text-4xl font-bold leading-tight break-keep">
          {recipe.steps[currentStep]}
        </div>

        {currentStep === 0 && (
          <div className="p-4 bg-gray-800 rounded-lg text-gray-300 text-sm break-keep">
            시작하기 전에 재료가 모두 준비되었는지 확인하세요: {recipe.ingredients.slice(0, 3).join(', ')}...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 grid grid-cols-2 gap-4 bg-gray-900 border-t border-gray-800">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            currentStep === 0 
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === recipe.steps.length - 1}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            currentStep === recipe.steps.length - 1
              ? 'bg-brand-900 text-brand-700 cursor-not-allowed'
              : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30'
          }`}
        >
          {currentStep === recipe.steps.length - 1 ? '완성!' : '다음'}
        </button>
      </div>
    </div>
  );
};