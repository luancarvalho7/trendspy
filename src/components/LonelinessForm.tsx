import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function LonelinessForm({ onContinue, formData }: FormStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(formData?.lonelinessFactors || []);

  const options = [
    'I spend most of my time alone',
    'I\'m around people but feel emotionally disconnected',
    'I don\'t have close friends or deep conversations',
    'I often feel left out or unwanted',
    'I don\'t get physical or emotional affection',
    'I have no one I\'d call if I needed help',
    'None of these apply to me'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length > 0 && onContinue) {
      onContinue({ lonelinessFactors: selectedOptions });
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (option === 'None of these apply to me') {
        // If "None of these apply to me" is being toggled
        if (prev.includes('None of these apply to me')) {
          // If "None of these apply to me" is already selected, deselect it
          return prev.filter(item => item !== 'None of these apply to me');
        } else {
          // If "None of these apply to me" is not selected, select it and clear all other options
          return ['None of these apply to me'];
        }
      } else {
        // If a specific option is being toggled
        const withoutNone = prev.filter(item => item !== 'None of these apply to me'); // Remove "None of these apply to me" if present
        
        if (withoutNone.includes(option)) {
          // If the option is already selected, deselect it
          return withoutNone.filter(item => item !== option);
        } else {
          // If the option is not selected, add it
          return [...withoutNone, option];
        }
      }
    });
  };

  const isValidSelection = selectedOptions.length > 0;

  // Filter options based on selection state
  // Hide "None of these apply to me" if any specific option is selected
  const hasSpecificOptions = selectedOptions.some(option => option !== 'None of these apply to me');
  const displayOptions = hasSpecificOptions 
    ? options.filter(option => option !== 'None of these apply to me')
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
          <div className="mb-12">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Which of these describe you lately?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Pick all that apply
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-32">
            {displayOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className={`w-full py-4 px-6 rounded-2xl border-2 transition-all duration-300 font-outfit text-left shadow-sm hover:shadow-md ${
                  selectedOptions.includes(option)
                    ? 'border-accent bg-accent/5 text-accent shadow-accent/10'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg leading-relaxed">
                    {option}
                  </span>
                  {selectedOptions.includes(option) && (
                    <svg className="w-5 h-5 text-accent flex-shrink-0 ml-3" fill="currentColor" viewBox="0 0 20 20">
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