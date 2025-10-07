import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function MissionSelectionForm({ onContinue, formData }: FormStepProps) {
  const [selectedMissions, setSelectedMissions] = useState<string[]>(formData?.brandMissions || []);

  const missions = [
    "Transformação do cliente",
    "Impacto social/cultural", 
    "Excelência e inovação",
    "Propósito pessoal/profissional",
    "Eficiência/Simplificação",
    "Acesso/Democratização",
    "Conexão/Comunidade",
    "Liberdade/Autonomia",
    "Legado/Inspiração",
    "Especialização/Nicho",
    "Proteção/Segurança",
    "Prazer/Estilo de vida",
    "Performance/Alta competição",
    "Sustentabilidade/Meio ambiente",
    "Educação/Consciência",
    "Exclusividade/Status",
    "Velocidade/Agilidade",
    "Exploração/Descoberta",
    "Identidade/Expressão pessoal",
    "Transformação cultural/comportamental",
    "Colaboração/Cocriação",
    "Justiça/Equidade",
    "Tradição/Preservação",
    "Saúde/Vitalidade",
    "Tecnologia/Futuro",
    "Entretenimento/Inspiração criativa",
    "Resiliência/Superação",
    "Hospitalidade/Cuidado"
  ];

  const handleMissionToggle = (missionTitle: string) => {
    if (selectedMissions.includes(missionTitle)) {
      // Remove if already selected
      setSelectedMissions(selectedMissions.filter(m => m !== missionTitle));
    } else {
      // Add if not selected and under limit
      if (selectedMissions.length < 3) {
        setSelectedMissions([...selectedMissions, missionTitle]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMissions.length > 0 && onContinue) {
      onContinue({ brandMissions: selectedMissions });
    }
  };

  const isValidToSubmit = selectedMissions.length > 0;

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
              Qual é a missão central da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 1 a 3 opções que mais se conectam à marca ({selectedMissions.length}/3)
            </p>
          </div>

          {/* Mission Options */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3 max-h-80 overflow-y-auto pr-2">
              {missions.map((mission) => {
                const isSelected = selectedMissions.includes(mission);
                const isDisabled = !isSelected && selectedMissions.length >= 3;
                
                return (
                  <button
                    key={mission}
                    type="button"
                    onClick={() => handleMissionToggle(mission)}
                    disabled={isDisabled}
                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-accent text-white'
                        : isDisabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                    }`}
                  >
                    {mission}
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