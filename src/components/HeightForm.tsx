import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HeightForm({ onContinue, formData }: FormStepProps) {
  const [selectedType, setSelectedType] = useState(formData?.socialNetworkType || '');

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ socialNetworkType: type });
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
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              A sua rede social é:
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            <button
              type="button"
              onClick={() => handleTypeSelection('Marca Pessoal')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedType === 'Marca Pessoal'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Marca Pessoal
            </button>
            
            <button
              type="button"
              onClick={() => handleTypeSelection('Empresa')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedType === 'Empresa'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Empresa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}