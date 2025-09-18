import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function StairsForm({ onContinue, formData }: FormStepProps) {
  const [selectedStairs, setSelectedStairs] = useState(formData?.stairsCapacity || '');

  const options = [
    '3 or more floors',
    '1–2 floors',
    'Less than 1 floor'
  ];

  const handleStairsSelection = (stairs: string) => {
    setSelectedStairs(stairs);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ stairsCapacity: stairs });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <div className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              How many flights of stairs can you climb without stopping?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Choose one
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleStairsSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedStairs === option
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}