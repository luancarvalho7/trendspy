import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function CompetitiveDifferentialsForm({ onContinue, formData }: FormStepProps) {
  const [selectedDifferentials, setSelectedDifferentials] = useState<string[]>(formData?.competitiveDifferentials || []);

  const differentials = [
    "Preço Acessível / Custo-benefício",
    "Qualidade Superior", 
    "Inovação Tecnológica",
    "Atendimento e Suporte Excepcional",
    "Personalização/Flexibilidade",
    "Marca Autêntica/História Única",
    "Velocidade/Agilidade na Entrega",
    "Conveniência e Facilidade de Uso",
    "Expertise/Especialização",
    "Impacto Socioambiental Positivo",
    "Comunidade e Networking",
    "Parcerias ou Acessos Exclusivos"
  ];

  const handleDifferentialToggle = (differential: string) => {
    if (selectedDifferentials.includes(differential)) {
      // Remove if already selected
      setSelectedDifferentials(selectedDifferentials.filter(d => d !== differential));
    } else {
      // Add if not selected and under limit
      if (selectedDifferentials.length < 3) {
        setSelectedDifferentials([...selectedDifferentials, differential]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDifferentials.length > 0 && onContinue) {
      onContinue({ competitiveDifferentials: selectedDifferentials });
    }
  };

  const isValidToSubmit = selectedDifferentials.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Quais são os principais diferenciais competitivos da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 1 a 3 diferenciais que realmente tornam a marca única ({selectedDifferentials.length}/3)
            </p>
          </div>

          {/* Differentials Options */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3 max-h-80 overflow-y-auto pr-2">
              {differentials.map((differential) => {
                const isSelected = selectedDifferentials.includes(differential);
                const isDisabled = !isSelected && selectedDifferentials.length >= 3;
                
                return (
                  <button
                    key={differential}
                    type="button"
                    onClick={() => handleDifferentialToggle(differential)}
                    disabled={isDisabled}
                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-accent text-white'
                        : isDisabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                    }`}
                  >
                    {differential}
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