import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function PregnancyForm({ onContinue, formData }: FormStepProps) {
  const [selectedStatus, setSelectedStatus] = useState(formData?.pregnancyStatus || '');

  const options = [
    'No',
    'Pregnant', 
    'Up to 12 months postpartum'
  ];

  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ pregnancyStatus: status });
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
              Are you currently pregnant or recently gave birth?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Within the last 12 months
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleStatusSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedStatus === option
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