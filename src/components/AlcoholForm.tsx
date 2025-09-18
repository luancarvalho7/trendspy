import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function AlcoholForm({ onContinue, formData }: FormStepProps) {
  const [selectedOption, setSelectedOption] = useState(formData?.alcoholConsumption || '');

  const options = [
    {
      emoji: '🚫',
      text: 'I don\'t drink at all'
    },
    {
      emoji: '🍷',
      text: 'I drink a little (0–7 drinks/week), never binge'
    },
    {
      emoji: '🍻',
      text: 'I drink more (8–14/week or binge sometimes)'
    },
    {
      emoji: '🥴',
      text: 'I drink a lot (>14/week or binge weekly)'
    }
  ];

  const handleOptionSelection = (option: string) => {
    setSelectedOption(option);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ alcoholConsumption: option });
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
          <div className="mb-12">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit leading-tight">
              How do you usually drink alcohol?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option.text}
                type="button"
                onClick={() => handleOptionSelection(option.text)}
                className={`w-full py-4 px-6 rounded-2xl border-2 transition-all duration-300 font-outfit text-left shadow-sm hover:shadow-md ${
                  selectedOption === option.text
                    ? 'border-accent bg-accent/5 text-accent shadow-accent/10'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl" role="img" aria-label="alcohol emoji">
                    {option.emoji}
                  </span>
                  <span className="text-lg leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}