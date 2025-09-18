import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function SleepForm({ onContinue, formData }: FormStepProps) {
  const [selectedSleep, setSelectedSleep] = useState(formData?.sleepHours || '');

  const options = [
    {
      value: '7–8 hours — Consistent, solid sleep',
      headline: 'Consistent, solid sleep',
      subheadline: '7–8 hours per night'
    },
    {
      value: '6–6.9 hours — Slightly short',
      headline: 'Slightly short',
      subheadline: '6–6.9 hours per night'
    },
    {
      value: 'Less than 6 hours — I\'m usually underslept',
      headline: 'I\'m usually underslept',
      subheadline: 'Less than 6 hours per night'
    },
    {
      value: 'More than 9 hours — I oversleep or still feel tired',
      headline: 'I oversleep or still feel tired',
      subheadline: 'More than 9 hours per night'
    }
  ];

  const handleSleepSelection = (sleepValue: string) => {
    setSelectedSleep(sleepValue);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ sleepHours: sleepValue });
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
              How many hours do you sleep on average per night?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSleepSelection(option.value)}
                className={`w-full py-5 px-6 rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedSleep === option.value
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-lg font-medium leading-tight">
                    {option.headline}
                  </div>
                  <div className="text-sm text-gray-500 font-normal">
                    {option.subheadline}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}