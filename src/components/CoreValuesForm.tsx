import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function CoreValuesForm({ onContinue, formData }: FormStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(formData?.coreValues || []);

  const values = [
    "Ética e Integridade",
    "Respeito às Pessoas", 
    "Excelência e Qualidade",
    "Inovação e Curiosidade",
    "Foco no Cliente",
    "Colaboração e Trabalho em Equipe",
    "Sustentabilidade e Responsabilidade Social",
    "Liberdade e Autonomia",
    "Coragem e Resiliência",
    "Humanidade e Empatia",
    "Disciplina",
    "Transparência Radical",
    "Velocidade/Agilidade",
    "Meritocracia e Reconhecimento",
    "Accountability (Responsabilização)",
    "Aprendizado Contínuo",
    "Pragmatismo e Simplicidade",
    "Generosidade e Compartilhamento",
    "Coragem Criativa",
    "Confiança",
    "Justiça",
    "Humildade",
    "Autenticidade",
    "Gratidão",
    "Espírito de Serviço",
    "Paciência",
    "Alegria",
    "Honra",
    "Determinação",
    "Visão de Futuro"
  ];

  const handleValueToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      // Remove if already selected
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      // Add if not selected and under limit
      if (selectedValues.length < 3) {
        setSelectedValues([...selectedValues, value]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedValues.length > 0 && onContinue) {
      onContinue({ coreValues: selectedValues });
    }
  };

  const isValidToSubmit = selectedValues.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6">
        <Logo />
      </div>

      {/* Phase Header */}
      <div className="px-6 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
            <h2 className="text-lg font-semibold text-accent text-center">
              Fase 2: Tom de Voz da Sua Marca
            </h2>
            <p className="text-sm text-accent/80 text-center mt-1">
              Etapa 1: Definir Identidade da Marca
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Quais valores não são negociáveis da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 1 a 3 valores centrais ({selectedValues.length}/3)
            </p>
          </div>

          {/* Values Options */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3 max-h-80 overflow-y-auto pr-2">
              {values.map((value) => {
                const isSelected = selectedValues.includes(value);
                const isDisabled = !isSelected && selectedValues.length >= 3;
                
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleValueToggle(value)}
                    disabled={isDisabled}
                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-accent text-white'
                        : isDisabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="pt-6 pb-8">
            <button
              type="submit"
              disabled={!isValidToSubmit}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidToSubmit
                  ? 'bg-black hover:bg-gray-800 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}