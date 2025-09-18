import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function ProfileMonitoringForm({ onContinue, formData }: FormStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(formData?.profileMonitoring || '');

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ profileMonitoring: answer });
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
              Você já sabe quais perfis quer monitorar?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            <button
              type="button"
              onClick={() => handleAnswerSelection('Sim')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedAnswer === 'Sim'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Sim
            </button>
            
            <button
              type="button"
              onClick={() => handleAnswerSelection('Não')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedAnswer === 'Não'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}