import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HT1Form({ onContinue, formData }: FormStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(formData?.ht1Medications || []);

  const options = [
    'Estrogen / estradiol',
    'Progestin / progesterone',
    'Testosterone',
    'Anti-androgen (testosterone blocker)',
    'Puberty blocker',
    'Not sure'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length > 0 && onContinue) {
      onContinue({ ht1Medications: selectedOptions });
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (option === 'Not sure') {
        // If "Not sure" is being toggled
        if (prev.includes('Not sure')) {
          // If "Not sure" is already selected, deselect it
          return prev.filter(item => item !== 'Not sure');
        } else {
          // If "Not sure" is not selected, select it and clear all other options
          return ['Not sure'];
        }
      } else {
        // If a specific medication is being toggled
        const withoutNotSure = prev.filter(item => item !== 'Not sure'); // Remove "Not sure" if present
        
        if (withoutNotSure.includes(option)) {
          // If the option is already selected, deselect it
          return withoutNotSure.filter(item => item !== option);
        } else {
          // If the option is not selected, add it
          return [...withoutNotSure, option];
        }
      }
    });
  };

  const isValidSelection = selectedOptions.length > 0;

  // Filter options based on selection state
  // Hide "Not sure" if any specific medication is selected
  const hasSpecificMedications = selectedOptions.some(option => option !== 'Not sure');
  const displayOptions = hasSpecificMedications 
    ? options.filter(option => option !== 'Not sure')
    : options;

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
              What are you taking right now?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Select all that apply
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-32">
            {displayOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedOptions.includes(option)
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedOptions.includes(option) && (
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidSelection}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidSelection
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