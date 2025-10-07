import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function BrandConsistencyForm({ onContinue, formData }: FormStepProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>(formData?.brandConsistencyElements || []);

  const consistencyElements = [
    'Guia de Tom de Voz Formalizado',
    'Identidade Visual e Mensagens-Chave Coerentes',
    'Adequação Multicanal',
    'Treinamento Interno Contínuo',
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
      onContinue({ brandConsistencyElements: selectedElements });
    }
  };

  const isValidToSubmit = selectedElements.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6">
        <Logo />
      </div>

      {/* Phase Header */}
      <div className="px-6 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-green-10 rounded-2xl p-4 border border-green-200">
            <h2 className="text-lg font-semibold text-green-700 text-center">
              Fase 2: Tom de Voz da Sua Marca
            </h2>
            <p className="text-sm text-green-600 text-center mt-1">
              Etapa Final: Consistência da Marca
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
              Como assegurar que a marca mantenha consistência ao crescer ou se expandir?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione os elementos de branding e planos de expansão relevantes ({selectedElements.length} selecionados)
            </p>
          </div>

          {/* Consistency Elements */}
          <div className="flex-1">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {/* Brand Consistency Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Diretrizes de Consistência
                </h3>
                <div className="flex flex-wrap gap-2">
                  {consistencyElements.slice(0, 4).map((element) => {
                    const isSelected = selectedElements.includes(element);
                    
                    return (
                      <button
                        key={element}
                        type="button"
                        onClick={() => handleElementToggle(element)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                        }`}
                      >
                        {element}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Long-term Vision Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Visão de Longo Prazo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {consistencyElements.slice(4).map((element) => {
                    const isSelected = selectedElements.includes(element);
                    
                    return (
                      <button
                        key={element}
                        type="button"
                        onClick={() => handleElementToggle(element)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                        }`}
                      >
                        {element}
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