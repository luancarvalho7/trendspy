import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function BrandConsistencyForm({ onContinue, formData }: FormStepProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>(formData?.brandConsistencyElements || []);

  const consistencyGuidelines = [
    'Guia de Tom de Voz Formalizado',
    'Identidade Visual e Mensagens-Chave Coerentes',
    'Adequação Multicanal',
    'Treinamento Interno Contínuo'
  ];

  const longTermVision = [
    'Ser Líder no Mercado X',
    'Expandir Portfólio de Produtos/Serviços',
    'Alcançar Novos Segmentos de Cliente',
    'Impacto e Legado',
    'Flexibilidade na Narrativa'
  ];

  const handleElementToggle = (element: string) => {
    if (selectedElements.includes(element)) {
      // Remove if already selected
      setSelectedElements(selectedElements.filter(e => e !== element));
    } else {
      // Add if not selected
      setSelectedElements([...selectedElements, element]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedElements.length > 0 && onContinue) {
      // Save final data
      onContinue({ brandConsistencyElements: selectedElements });
      
      // Redirect to external URL after a brief delay
      setTimeout(() => {
        window.location.href = 'https://carrossel-de-cria-bolt.vercel.app/';
      }, 500);
    }
  };

  const isValidToSubmit = selectedElements.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Como assegurar que a marca mantenha consistência ao crescer ou se expandir?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione os elementos de branding e planos de expansão relevantes ({selectedElements.length} selecionados)
            </p>
          </div>

          {/* Sections */}
          <div className="flex-1 space-y-8">
            {/* Consistency Guidelines Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-bold">📋</span>
                </div>
                Diretrizes de Consistência
              </h3>
              <div className="space-y-3">
                {consistencyGuidelines.map((element) => {
                  const isSelected = selectedElements.includes(element);
                  
                  return (
                    <button
                      key={element}
                      type="button"
                      onClick={() => handleElementToggle(element)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{element}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && (
                            <span className="text-white text-xs font-bold">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Long-term Vision Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-sm font-bold">🚀</span>
                </div>
                Visão de Longo Prazo
              </h3>
              <div className="space-y-3">
                {longTermVision.map((element) => {
                  const isSelected = selectedElements.includes(element);
                  
                  return (
                    <button
                      key={element}
                      type="button"
                      onClick={() => handleElementToggle(element)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{element}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && (
                            <span className="text-white text-xs font-bold">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
              Finalizar Questionário
            </button>
            {!isValidToSubmit && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Selecione pelo menos um elemento para continuar
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}