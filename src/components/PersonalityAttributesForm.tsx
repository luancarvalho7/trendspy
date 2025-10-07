import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function PersonalityAttributesForm({ onContinue, formData }: FormStepProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(formData?.personalityAttributes || []);

  const attributePairs = [
    { positive: 'Amigável / Conversacional', negative: 'Formal / Polido' },
    { positive: 'Descontraído / Divertido', negative: 'Sério / Sóbrio' },
    { positive: 'Inspirador / Emocional', negative: 'Informativo / Direto' },
    { positive: 'Inovador / Vanguardista', negative: 'Tradicional / Conservador' },
    { positive: 'Autoritativo / Especialista', negative: 'Humilde / Colaborativo' },
    { positive: 'Enérgico / Entusiasmado', negative: 'Calmo / Paciente' },
    { positive: 'Exclusivo / Sofisticado', negative: 'Acessível / Simples' },
    { positive: 'Empático / Acolhedor', negative: 'Objetivo / Frio' }
  ];

  // Flatten all attributes for easier processing
  const allAttributes = attributePairs.flatMap(pair => [pair.positive, pair.negative]);

  const handleAttributeToggle = (attribute: string) => {
    if (selectedAttributes.includes(attribute)) {
      // Remove if already selected
      setSelectedAttributes(selectedAttributes.filter(a => a !== attribute));
    } else {
      // Add if not selected and under limit
      if (selectedAttributes.length < 5) {
        setSelectedAttributes([...selectedAttributes, attribute]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAttributes.length >= 3 && onContinue) {
      onContinue({ personalityAttributes: selectedAttributes });
    }
  };

  const isValidToSubmit = selectedAttributes.length >= 3 && selectedAttributes.length <= 5;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6">
        <Logo />
      </div>

      {/* Phase Header */}
      <div className="px-6 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-purple-10 rounded-2xl p-4 border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-700 text-center">
              Fase 2: Tom de Voz da Sua Marca
            </h2>
            <p className="text-sm text-purple-600 text-center mt-1">
              Etapa 2: Definir Atributos de Personalidade
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
              Quais atributos de personalidade definem o tom de voz da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 3 a 5 adjetivos que melhor descrevem o estilo de comunicação desejado ({selectedAttributes.length}/5)
            </p>
            <p className="text-xs text-amber-600 mt-1">
              💡 Evite escolher atributos opostos (ex: Descontraído + Sério)
            </p>
          </div>

          {/* Attribute Pairs */}
          <div className="flex-1">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {attributePairs.map((pair, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {/* Positive attribute */}
                    <button
                      type="button"
                      onClick={() => handleAttributeToggle(pair.positive)}
                      disabled={!selectedAttributes.includes(pair.positive) && selectedAttributes.length >= 5}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-1 min-w-[140px] ${
                        selectedAttributes.includes(pair.positive)
                          ? 'bg-blue-500 text-white'
                          : (!selectedAttributes.includes(pair.positive) && selectedAttributes.length >= 5)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {pair.positive}
                    </button>
                    
                    {/* VS separator */}
                    <div className="flex items-center px-2">
                      <span className="text-xs text-gray-400">vs</span>
                    </div>
                    
                    {/* Negative attribute */}
                    <button
                      type="button"
                      onClick={() => handleAttributeToggle(pair.negative)}
                      disabled={!selectedAttributes.includes(pair.negative) && selectedAttributes.length >= 5}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-1 min-w-[140px] ${
                        selectedAttributes.includes(pair.negative)
                          ? 'bg-green-500 text-white'
                          : (!selectedAttributes.includes(pair.negative) && selectedAttributes.length >= 5)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {pair.negative}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Attributes Preview */}
          {selectedAttributes.length > 0 && (
            <div className="pt-4 pb-2 border-t border-gray-100">
              <div className="text-xs text-gray-600 mb-2">Selecionados:</div>
              <div className="flex flex-wrap gap-2">
                {selectedAttributes.map((attr, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

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
            {selectedAttributes.length < 3 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Selecione pelo menos 3 atributos para continuar
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}