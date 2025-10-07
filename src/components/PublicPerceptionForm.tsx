import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function PublicPerceptionForm({ onContinue, formData }: FormStepProps) {
  const [selectedPerception, setSelectedPerception] = useState(formData?.publicPerception || '');

  const perceptions = [
    'Desconhecimento',
    'Ceticismo',
    'Insatisfação Latente',
    'Satisfeito com Concorrente',
    'Sensível a Preço',
    'Consciente e Exigente',
    'Entusiastas da Marca (caso já tenha clientes)'
  ];

  const handlePerceptionSelection = (perception: string) => {
    setSelectedPerception(perception);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ publicPerception: perception });
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
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Como o público percebe atualmente as soluções existentes (ou a própria marca, se já tiver presença)?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione a opção que mais reflete a situação atual
            </p>
          </div>

          {/* Perception Options */}
          <div className="flex-1 space-y-3 pb-20">
            {perceptions.map((perception) => (
              <button
                key={perception}
                type="button"
                onClick={() => handlePerceptionSelection(perception)}
                className={`w-full py-4 px-6 text-base rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedPerception === perception
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                {perception}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}