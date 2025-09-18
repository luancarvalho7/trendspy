import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HT4Form({ onContinue, formData, currentMedication }: FormStepProps) {
  const currentData = currentMedication && formData?.htMedications?.[currentMedication];
  const [selectedChange, setSelectedChange] = useState(currentData?.doseChange || '');

  const options = [
    'In the past 3 months',
    'More than 3 months ago',
    'No / not sure'
  ];

  const handleChangeSelection = (change: string) => {
    setSelectedChange(change);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        if (currentMedication) {
          onContinue({ 
            htMedications: { 
              [currentMedication]: { doseChange: change } 
            } 
          });
        } else {
          onContinue({ ht4DoseChange: change });
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
              {currentMedication ? `Any recent dose change on the ${currentMedication}?` : 'Any recent dose change?'}
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleChangeSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedChange === option
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