import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HormoneTherapyForm({ onContinue, formData }: FormStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(formData?.hormoneTherapy || '');

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ hormoneTherapy: answer });
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
              Are you currently on hormone therapy?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            <button
              type="button"
              onClick={() => handleAnswerSelection('Yes')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedAnswer === 'Yes'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Yes
            </button>
            
            <button
              type="button"
              onClick={() => handleAnswerSelection('No')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedAnswer === 'No'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}