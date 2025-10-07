import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function CompetitiveContextForm({ onContinue, formData }: FormStepProps) {
  const [selectedContext, setSelectedContext] = useState(formData?.competitiveContext || '');

  const contexts = [
    '"Pioneira" – Mercado Emergente',
    '"Desafiante" – Ingressando contra Gigantes',
    '"Disruptiva" – Quebrando o Status Quo',
    '"Líder estabelecida" – Referência de Mercado',
    '"Especialista de Nicho" – Foco segmentado',
    '"Concorrência Fragmentada" – Muitos Jogadores Pequenos'
  ];

  const handleContextSelection = (context: string) => {
    setSelectedContext(context);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ competitiveContext: context });
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
              Qual afirmação melhor descreve o contexto competitivo da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione aquela que mais se aproxima da situação atual
            </p>
          </div>

          {/* Context Options */}
          <div className="flex-1 space-y-3 pb-20">
            {contexts.map((context) => (
              <button
                key={context}
                type="button"
                onClick={() => handleContextSelection(context)}
                className={`w-full py-4 px-6 text-base rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedContext === context
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                {context}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}