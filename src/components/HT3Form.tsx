import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HT3Form({ onContinue, formData, currentMedication }: FormStepProps) {
  const currentData = currentMedication && formData?.htMedications?.[currentMedication];
  const [selectedDuration, setSelectedDuration] = useState(currentData?.duration || '');

  const options = [
    'Less than 3 months',
    '3–12 months',
    'More than 12 months'
  ];

  const handleDurationSelection = (duration: string) => {
    setSelectedDuration(duration);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        if (currentMedication) {
          onContinue({ 
            htMedications: { 
              [currentMedication]: { duration } 
            } 
          });
        } else {
          onContinue({ ht3Duration: duration });
        }
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
              {currentMedication ? `How long on your current plan of ${currentMedication}?` : 'How long on your current plan?'}
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleDurationSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedDuration === option
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