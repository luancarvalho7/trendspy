import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function EmotionalBenefitsForm({ onContinue, formData }: FormStepProps) {
  const [selectedBenefit, setSelectedBenefit] = useState(formData?.emotionalBenefit || '');

  const benefits = [
    'Tranquilidade/Paz de Espírito',
    'Sentimento de Confiança',
    'Status/Orgulho',
    'Pertencimento',
    'Inspiração/Motivação',
    'Diversão/Alegria',
    'Realização Pessoal',
    'Alívio/Conforto',
    'Conexão Emocional',
    'Autonomia/Liberdade'
  ];

  const handleBenefitSelection = (benefit: string) => {
    setSelectedBenefit(benefit);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ emotionalBenefit: benefit });
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
              Qual é o principal benefício emocional/intangível que a marca proporciona?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione se houver um apelo emocional claro na proposta de valor
            </p>
          </div>

          {/* Benefit Options */}
          <div className="flex-1 space-y-3 pb-20">
            {benefits.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => handleBenefitSelection(benefit)}
                className={`w-full py-4 px-6 text-base rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedBenefit === benefit
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                {benefit}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}