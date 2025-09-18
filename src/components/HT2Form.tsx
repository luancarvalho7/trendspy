import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

// Define medication-specific administration methods
const medicationMethods: { [key: string]: string[] } = {
  'Estrogen / estradiol': [
    'Pills (by mouth)',
    'Patch',
    'Gel or cream',
    'Injection (shot)',
    'Implant or pellet',
    'Not sure'
  ],
  'Progestin / progesterone': [
    'Pills (by mouth)',
    'Injection (shot)',
    'Implant or pellet',
    'Gel or cream',
    'Not sure'
  ],
  'Testosterone': [
    'Gel or cream',
    'Injection (shot)', 
    'Patch',
    'Implant or pellet',
    'Not sure'
  ],
  'Anti-androgen (testosterone blocker)': [
    'Pills (by mouth)',
    'Not sure'
  ],
  'Puberty blocker': [
    'Injection (shot)',
    'Implant or pellet',
    'Not sure'
  ],
  'Not sure': [
    'Not sure'
  ]
};

// Default options if medication not found in mapping
const defaultOptions = [
  'Pills (by mouth)',
  'Patch',
  'Gel or cream',
  'Injection (shot)',
  'Implant or pellet',
  'Not sure'
];

export default function HT2Form({ onContinue, formData, currentMedication }: FormStepProps) {
  const currentData = currentMedication && formData?.htMedications?.[currentMedication];
  const [selectedMethod, setSelectedMethod] = useState(currentData?.method || '');

  // Get dynamic options based on current medication
  const options = currentMedication 
    ? medicationMethods[currentMedication] || defaultOptions
    : defaultOptions;

  // Clear selected method if it's no longer valid for the current medication
  useEffect(() => {
    if (selectedMethod && !options.includes(selectedMethod)) {
      setSelectedMethod('');
    }
  }, [currentMedication, options, selectedMethod]);

  const handleMethodSelection = (method: string) => {
    setSelectedMethod(method);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        if (currentMedication) {
          onContinue({ 
            htMedications: { 
              [currentMedication]: { method } 
            } 
          });
        } else {
          onContinue({ ht2Method: method });
        }
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
              {currentMedication ? `How do you take ${currentMedication}?` : 'How do you take it?'}
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleMethodSelection(option)}
                className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                  selectedMethod === option
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}