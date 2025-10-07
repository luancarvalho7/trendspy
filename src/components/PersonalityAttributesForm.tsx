import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function PersonalityAttributesForm({ onContinue, formData }: FormStepProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(formData?.personalityAttributes || []);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

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

  const currentPair = attributePairs[currentPairIndex];

  const handleAttributeSelection = (attribute: string) => {
    const otherAttribute = attribute === currentPair.positive ? currentPair.negative : currentPair.positive;
    
    // Remove both attributes from current pair first
    let newAttributes = selectedAttributes.filter(attr => 
      attr !== currentPair.positive && attr !== currentPair.negative
    );
    
    // Add the selected attribute
    newAttributes.push(attribute);
    
    setSelectedAttributes(newAttributes);
    
    // Auto advance to next pair after selection
    setTimeout(() => {
      if (currentPairIndex < attributePairs.length - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
      }
    }, 500);
  };

  const handlePreviousPair = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(currentPairIndex - 1);
    }
  };

  const handleNextPair = () => {
    if (currentPairIndex < attributePairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAttributes.length >= 3 && onContinue) {
      onContinue({ personalityAttributes: selectedAttributes });
    }
  };

  const isValidToSubmit = selectedAttributes.length >= 3;
  const currentPairSelection = selectedAttributes.find(attr => 
    attr === currentPair.positive || attr === currentPair.negative
  );

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
              Quais atributos de personalidade definem o tom de voz da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 3 a 5 adjetivos que melhor descrevem o estilo de comunicação desejado
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-amber-600">
                💡 Escolha um de cada comparação
              </p>
              <p className="text-xs text-gray-500">
                {selectedAttributes.length}/8 selecionados
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Comparação {currentPairIndex + 1} de {attributePairs.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentPairIndex + 1) / attributePairs.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Pair Comparison */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              {/* Pair separator */}
              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-4 text-sm text-gray-500 bg-gray-50 font-medium">ou</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              
              {/* Attribute buttons */}
              <div className="space-y-4">
                {/* First attribute */}
                <button
                  type="button"
                  onClick={() => handleAttributeSelection(currentPair.positive)}
                  className={`w-full py-4 px-6 text-base rounded-2xl font-medium transition-all duration-200 text-left ${
                    currentPairSelection === currentPair.positive
                      ? 'bg-accent text-white shadow-lg border-2 border-accent'
                      : 'bg-white text-gray-700 hover:bg-accent hover:text-white border-2 border-gray-200 hover:border-accent'
                  }`}
                >
                  {currentPair.positive}
                </button>
                
                {/* Second attribute */}
                <button
                  type="button"
                  onClick={() => handleAttributeSelection(currentPair.negative)}
                  className={`w-full py-4 px-6 text-base rounded-2xl font-medium transition-all duration-200 text-left ${
                    currentPairSelection === currentPair.negative
                      ? 'bg-accent text-white shadow-lg border-2 border-accent'
                      : 'bg-white text-gray-700 hover:bg-accent hover:text-white border-2 border-gray-200 hover:border-accent'
                  }`}
                >
                  {currentPair.negative}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 space-x-4">
              <button
                type="button"
                onClick={handlePreviousPair}
                disabled={currentPairIndex === 0}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  currentPairIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ← Anterior
              </button>
              
              <button
                type="button"
                onClick={handleNextPair}
                disabled={currentPairIndex === attributePairs.length - 1}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  currentPairIndex === attributePairs.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90'
                }`}
              >
                Próximo →
              </button>
            </div>
          </div>

          {/* Selected Attributes Summary */}
          {selectedAttributes.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Atributos Selecionados:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAttributes.map((attr, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

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
                Complete pelo menos 3 comparações para continuar
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