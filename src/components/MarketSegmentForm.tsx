import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function MarketSegmentForm({ onContinue, formData }: FormStepProps) {
  const [selectedSegment, setSelectedSegment] = useState(formData?.marketSegment || '');
  const [customSegment, setCustomSegment] = useState(formData?.customMarketSegment || '');

  const segments = [
    "Tecnologia (Software/Serviços Digitais)",
    "Finanças (Fintech/Serviços Financeiros)",
    "Saúde e Bem-estar",
    "Educação",
    "Varejo e Bens de Consumo",
    "Alimentação/Hospitalidade",
    "Indústria/Manufatura",
    "Serviços Profissionais",
    "ONG/Impacto Social",
    "Outro (Nicho Específico)"
  ];

  const handleSegmentSelection = (segment: string) => {
    setSelectedSegment(segment);
    
    // If not "Outro", submit immediately
    if (segment !== "Outro (Nicho Específico)") {
      setTimeout(() => {
        if (onContinue) {
          onContinue({ 
            marketSegment: segment,
            customMarketSegment: '' // Clear custom segment if selecting predefined
          });
        }
      }, 300);
    }
  };

  const handleCustomSegmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSegment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidToSubmit() && onContinue) {
      onContinue({ 
        marketSegment: selectedSegment,
        customMarketSegment: selectedSegment === "Outro (Nicho Específico)" ? customSegment.trim() : ''
      });
    }
  };

  const isValidToSubmit = () => {
    if (!selectedSegment) return false;
    if (selectedSegment === "Outro (Nicho Específico)") {
      return customSegment.trim().length >= 2;
    }
    return true;
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
              Em qual segmento de mercado a marca atua?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione a categoria principal ou descreva em poucas palavras
            </p>
          </div>

          {/* Market Segment Options */}
          <div className="flex-1">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {segments.map((segment) => (
                <button
                  key={segment}
                  type="button"
                  onClick={() => handleSegmentSelection(segment)}
                  className={`w-full py-3 px-4 text-sm rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                    selectedSegment === segment
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                  }`}
                >
                  {segment}
                </button>
              ))}
            </div>

            {/* Custom Segment Input */}
            {selectedSegment === "Outro (Nicho Específico)" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva seu segmento:
                </label>
                <input
                  type="text"
                  value={customSegment}
                  onChange={handleCustomSegmentChange}
                  className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                  placeholder="Ex: Agronegócio, Blockchain, etc."
                  maxLength={50}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="pt-6 pb-8">
            {selectedSegment === "Outro (Nicho Específico)" ? (
              <button
                type="submit"
                disabled={!isValidToSubmit()}
                className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                  isValidToSubmit()
                    ? 'bg-black hover:bg-gray-800 active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <div className="text-center text-sm text-gray-500">
                {selectedSegment ? 'Redirecionando...' : 'Selecione um segmento para continuar'}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}