import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function SexForm({ onContinue, formData }: FormStepProps) {
  const [selectedSex, setSelectedSex] = useState(formData?.sex || '');

  const handleSexSelection = (sex: string) => {
    setSelectedSex(sex);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ sex });
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
              Were you born male or female?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            <button
              type="button"
              onClick={() => handleSexSelection('Male')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedSex === 'Male'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Male
            </button>
            
            <button
              type="button"
              onClick={() => handleSexSelection('Female')}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                selectedSex === 'Female'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}