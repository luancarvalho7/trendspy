import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function StressForm({ onContinue, formData }: FormStepProps) {
  const [stressLevel, setStressLevel] = useState(formData?.stressLevel || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onContinue) {
      onContinue({ stressLevel: stressLevel.toString() });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStressLevel(parseInt(e.target.value));
  };

  // Get color and description based on stress level
  const getStressInfo = (level: number) => {
    if (level <= 4) {
      return { 
        color: 'text-green-600', 
        bgColor: 'bg-green-100', 
        description: 'Low stress',
        emoji: '😌'
      };
    } else if (level <= 7) {
      return { 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100', 
        description: 'Moderate stress',
        emoji: '😰'
      };
    } else {
      return { 
        color: 'text-red-600', 
        bgColor: 'bg-red-100', 
        description: 'High stress',
        emoji: '😫'
      };
    }
  };

  const stressInfo = getStressInfo(stressLevel);

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit leading-tight">
              How stressed have you felt in the last 2 weeks?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Slide to rate your stress level
            </p>
          </div>

          {/* Stress Level Display */}
          <div className="mb-8">
            <div className={`${stressInfo.bgColor} rounded-2xl p-6 text-center transition-all duration-300`}>
              <div className="text-4xl mb-3">
                {stressInfo.emoji}
              </div>
              <div className={`text-4xl font-bold ${stressInfo.color} mb-2`}>
                {stressLevel}/10
              </div>
              <div className={`text-lg font-medium ${stressInfo.color} mb-1`}>
                {stressInfo.description}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="10"
                value={stressLevel}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, 
                    #10b981 0%, #10b981 40%, 
                    #f59e0b 40%, #f59e0b 70%, 
                    #ef4444 70%, #ef4444 100%)`
                }}
              />
              {/* Slider Thumb Custom Styling */}
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${stressLevel <= 4 ? '#10b981' : stressLevel <= 7 ? '#f59e0b' : '#ef4444'};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                  transition: all 0.2s ease;
                }
                
                .slider::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }

                .slider::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${stressLevel <= 4 ? '#10b981' : stressLevel <= 7 ? '#f59e0b' : '#ef4444'};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }
              `}</style>
              
              {/* Scale Labels */}
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </div>
            </div>
            
            {/* Range Descriptions */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">😌</span>
                  <span className="text-green-700 font-medium">0–4: Low stress</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">😰</span>
                  <span className="text-yellow-700 font-medium">5–7: Moderate stress</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-50">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">😫</span>
                  <span className="text-red-700 font-medium">8–10: High stress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit bg-black hover:bg-gray-800 active:scale-95"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}