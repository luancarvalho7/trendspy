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
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
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
              Selecione de 3 a 5 adjetivos que melhor descrevem o estilo de comunicação desejado
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-amber-600">
                💡 Evite escolher atributos opostos
              </p>
              <p className="text-xs text-gray-500">
                {selectedAttributes.length}/5 selecionados
              </p>
            </div>
          </div>

          {/* Attribute Pairs */}
          <div className="flex-1">
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {attributePairs.map((pair, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  {/* Pair number and separator */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="px-3 text-xs text-gray-500 bg-gray-50">ou</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                  
                  {/* Attribute buttons */}
                  <div className="space-y-3">
                    {/* First attribute */}
                    <button
                      type="button"
                      onClick={() => handleAttributeToggle(pair.positive)}
                      disabled={!selectedAttributes.includes(pair.positive) && selectedAttributes.length >= 5}
                      className={`w-full py-3 px-4 text-sm rounded-xl font-medium transition-all duration-200 text-left ${
                        selectedAttributes.includes(pair.positive)
                          ? 'bg-accent text-white shadow-md border-2 border-accent'
                          : (!selectedAttributes.includes(pair.positive) && selectedAttributes.length >= 5)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-transparent'
                          : 'bg-white text-gray-700 hover:bg-accent hover:text-white border-2 border-gray-200 hover:border-accent'
                      }`}
                    >
                      {pair.positive}
                    </button>
                    
                    {/* Second attribute */}
                    <button
                      type="button"
                      onClick={() => handleAttributeToggle(pair.negative)}
                      disabled={!selectedAttributes.includes(pair.negative) && selectedAttributes.length >= 5}
                      className={`w-full py-3 px-4 text-sm rounded-xl font-medium transition-all duration-200 text-left ${
                        selectedAttributes.includes(pair.negative)
                          ? 'bg-accent text-white shadow-md border-2 border-accent'
                          : (!selectedAttributes.includes(pair.negative) && selectedAttributes.length >= 5)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-transparent'
                          : 'bg-white text-gray-700 hover:bg-accent hover:text-white border-2 border-gray-200 hover:border-accent'
                      }`}
                    >
                      {pair.negative}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="pt-6 pb-8 border-t border-gray-100 mt-4">
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
            {selectedAttributes.length >= 3 && (
              <p className="text-xs text-green-600 text-center mt-2">
                ✓ {selectedAttributes.length} atributos selecionados
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}