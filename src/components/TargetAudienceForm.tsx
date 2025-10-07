import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function TargetAudienceForm({ onContinue, formData }: FormStepProps) {
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(formData?.targetAudience || []);

  const audiences = [
    // B2C Options
    { category: 'B2C', name: 'Jovens Adultos Urbanos' },
    { category: 'B2C', name: 'Famílias e Pais/Mães' },
    { category: 'B2C', name: 'Adolescentes / Geração Z' },
    { category: 'B2C', name: 'Profissionais em Início de Carreira' },
    { category: 'B2C', name: 'Classe Alta / Público Premium' },
    { category: 'B2C', name: 'Nichos de Interesse Específico' },
    { category: 'B2C', name: 'Seniors da Melhor Idade' },
    
    // B2B Options  
    { category: 'B2B', name: 'Pequenas e Médias Empresas' },
    { category: 'B2B', name: 'Grandes Empresas / Corporativo' },
    { category: 'B2B', name: 'Startups e Empresas Inovadoras' },
    { category: 'B2B', name: 'Setor Público/Instituições' },
    { category: 'B2B', name: 'Por Área de Atuação' },
    { category: 'B2B', name: 'Decisores e Personas Específicas' }
  ];

  const handleAudienceToggle = (audienceName: string) => {
    if (selectedAudiences.includes(audienceName)) {
      // Remove if already selected
      setSelectedAudiences(selectedAudiences.filter(a => a !== audienceName));
    } else {
      // Add if not selected (no limit specified, so allow multiple)
      setSelectedAudiences([...selectedAudiences, audienceName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAudiences.length > 0 && onContinue) {
      onContinue({ targetAudience: selectedAudiences });
    }
  };

  const isValidToSubmit = selectedAudiences.length > 0;

  const groupedAudiences = {
    'B2C': audiences.filter(a => a.category === 'B2C'),
    'B2B': audiences.filter(a => a.category === 'B2B')
  };

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
              Quem é o público-alvo principal da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione as descrições que mais se aproximam do seu público ({selectedAudiences.length} selecionados)
            </p>
          </div>

          {/* Audience Options */}
          <div className="flex-1">
            <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
              {/* B2C Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Consumidores Finais (B2C)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedAudiences.B2C.map((audience) => {
                    const isSelected = selectedAudiences.includes(audience.name);
                    
                    return (
                      <button
                        key={audience.name}
                        type="button"
                        onClick={() => handleAudienceToggle(audience.name)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                        }`}
                      >
                        {audience.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* B2B Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Empresas/Organizações (B2B)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedAudiences.B2B.map((audience) => {
                    const isSelected = selectedAudiences.includes(audience.name);
                    
                    return (
                      <button
                        key={audience.name}
                        type="button"
                        onClick={() => handleAudienceToggle(audience.name)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                        }`}
                      >
                        {audience.name}
                      </button>
                    );
                  })}
                </div>
              </div>
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