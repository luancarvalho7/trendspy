import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function NicheForm({ onContinue, formData }: FormStepProps) {
  // Check if we have niches from website analysis, otherwise use existing niches
  const getInitialNiches = () => {
    // If we have niches from website analysis, use those
    if (formData?.niches && formData.niches.length > 0) {
      return formData.niches;
    }
    return [];
  };
  
  const [niches, setNiches] = useState<string[]>(getInitialNiches());
  const [currentNiche, setCurrentNiche] = useState('');

  const handleAddNiche = () => {
    const trimmedNiche = currentNiche.trim();
    if (trimmedNiche && !niches.includes(trimmedNiche) && niches.length < 6) {
      setNiches([...niches, trimmedNiche]);
      setCurrentNiche('');
    }
  };

  const handleRemoveNiche = (index: number) => {
    setNiches(niches.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNiche();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (niches.length > 0 && onContinue) {
      onContinue({ niches });
    }
  };

  const isValidToSubmit = niches.length > 0;

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
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              Qual ou quais são os seus nicho(s)?
            </h1>
            {niches.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Nichos sugeridos baseados no seu website
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Digite um nicho e pressione Enter para adicionar (máximo 6)
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentNiche}
                onChange={(e) => setCurrentNiche(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                placeholder="Ex: Tecnologia, Lifestyle, Negócios..."
                maxLength={50}
                disabled={niches.length >= 6}
              />
              <button
                type="button"
                onClick={handleAddNiche}
                disabled={!currentNiche.trim() || niches.includes(currentNiche.trim()) || niches.length >= 6}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  currentNiche.trim() && !niches.includes(currentNiche.trim()) && niches.length < 6
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Added Niches */}
          <div className="flex-1">
            {niches.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Nichos adicionados ({niches.length}/6):
                </div>
                <div className="space-y-2">
                  {niches.map((niche, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-xl"
                    >
                      <span className="text-accent font-medium">{niche}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNiche(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
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