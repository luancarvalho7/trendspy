import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WeightChangeForm({ onContinue, formData }: FormStepProps) {
  const [hasWebsite, setHasWebsite] = useState(formData?.hasWebsite || '');

  const options = [
    'Sim',
    'Não'
  ];

  const handleWebsiteSelection = (answer: string) => {
    setHasWebsite(answer);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ hasWebsite: answer });
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
              Você tem um site?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleWebsiteSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-300 font-outfit text-left shadow-sm hover:shadow-md ${
                  hasWebsite === option
                    ? 'border-accent bg-accent/5 text-accent shadow-accent/10'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
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