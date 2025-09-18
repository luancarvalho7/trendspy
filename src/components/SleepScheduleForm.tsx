import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function SleepScheduleForm({ onContinue, formData }: FormStepProps) {
  const [selectedSchedule, setSelectedSchedule] = useState(formData?.sleepSchedule || '');

  const options = [
    {
      value: 'I sleep and wake at about the same time every day (±30 min, even on weekends)',
      headline: 'Same time every day, even weekends',
      subheadline: 'Within 30 minutes variation'
    },
    {
      value: 'I\'m a little inconsistent, but not chaotic (±1–2 hours variation)',
      headline: 'A little inconsistent, but not chaotic',
      subheadline: '1–2 hours variation'
    },
    {
      value: 'My schedule shifts a lot day to day (late nights, irregular wake-ups)',
      headline: 'My schedule shifts a lot day to day',
      subheadline: 'Late nights, irregular wake-ups'
    },
    {
      value: 'I work night shifts or have no set pattern at all',
      headline: 'Night shifts or no set pattern',
      subheadline: 'Completely irregular schedule'
    }
  ];

  const handleScheduleSelection = (scheduleValue: string) => {
    setSelectedSchedule(scheduleValue);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ sleepSchedule: scheduleValue });
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
              How consistent is your daily sleep/wake schedule?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Pick the one that fits best
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleScheduleSelection(option.value)}
                className={`w-full py-5 px-6 rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedSchedule === option.value
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