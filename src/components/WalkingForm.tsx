import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WalkingForm({ onContinue, formData }: FormStepProps) {
  const [selectedActivity, setSelectedActivity] = useState(formData?.walkingActivity || '');

  const options = [
    {
      value: '300+ minutes (5+ hours) — I walk 45+ minutes every day',
      headline: 'I walk 45+ minutes every day',
      subheadline: '300+ minutes (5+ hours) per week'
    },
    {
      value: '150–299 minutes — I walk 20–45 minutes most days',
      headline: 'I walk 20–45 minutes most days',
      subheadline: '150–299 minutes per week'
    },
    {
      value: '60–149 minutes — I walk a few short times per week',
      headline: 'I walk a few short times per week',
      subheadline: '60–149 minutes per week'
    },
    {
      value: 'Less than 60 minutes — I barely walk most days',
      headline: 'I barely walk most days',
      subheadline: 'Less than 60 minutes per week'
    }
  ];

  const handleActivitySelection = (activityValue: string) => {
    setSelectedActivity(activityValue);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ walkingActivity: activityValue });
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
              How much do you usually walk per week?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleActivitySelection(option.value)}
                className={`w-full py-5 px-6 rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedActivity === option.value
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