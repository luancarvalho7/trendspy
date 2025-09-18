import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function MainObjectiveForm({ onContinue, formData }: FormStepProps) {
  const [selectedObjective, setSelectedObjective] = useState(formData?.mainObjective || '');

  const objectives = [
    {
      emoji: '🌍',
      text: 'Aumentar audiência'
    },
    {
      emoji: '👶',
      text: 'Crescer perfil do zero'
    },
    {
      emoji: '💰',
      text: 'Monetizar audiência'
    },
    {
      emoji: '❤️',
      text: 'Aumentar engajamento'
    }
  ];

  const handleObjectiveSelection = (objective: string) => {
    setSelectedObjective(objective);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ mainObjective: objective });
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
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Qual seu objetivo principal?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {objectives.map((objective) => (
              <button
                key={objective.text}
                type="button"
                onClick={() => handleObjectiveSelection(objective.text)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedObjective === objective.text
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl" role="img" aria-label="objective emoji">
                    {objective.emoji}
                  </span>
                  <span>
                    {objective.text}
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