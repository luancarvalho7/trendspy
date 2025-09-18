import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function FamilyHistoryForm({ onContinue, formData }: FormStepProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(formData?.familyHistory || []);

  const conditions = [
    {
      emoji: '❤️',
      text: 'Parent or sibling had heart attack or stroke early',
      subtext: '(Men <55, Women <65)'
    },
    {
      emoji: '🎉',
      text: 'Any parent lived to 90 or more'
    },
    {
      emoji: '🚫',
      text: 'None of these'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConditions.length > 0 && onContinue) {
      onContinue({ familyHistory: selectedConditions });
    }
  };

  const toggleCondition = (conditionText: string) => {
    setSelectedConditions(prev => {
      if (conditionText === 'None of these') {
        // If "None of these" is being toggled
        if (prev.includes('None of these')) {
          // If "None of these" is already selected, deselect it
          return prev.filter(item => item !== 'None of these');
        } else {
          // If "None of these" is not selected, select it and clear all other conditions
          return ['None of these'];
        }
      } else {
        // If a specific condition is being toggled
        const withoutNone = prev.filter(item => item !== 'None of these'); // Remove "None of these" if present
        
        if (withoutNone.includes(conditionText)) {
          // If the condition is already selected, deselect it
          return withoutNone.filter(item => item !== conditionText);
        } else {
          // If the condition is not selected, add it
          return [...withoutNone, conditionText];
        }
      }
    });
  };

  const isValidSelection = selectedConditions.length > 0;

  // Filter conditions based on selection state
  // Hide "None of these" if any specific condition is selected
  const hasSpecificConditions = selectedConditions.some(condition => condition !== 'None of these');
  const displayConditions = hasSpecificConditions 
    ? conditions.filter(condition => condition.text !== 'None of these')
    : conditions;

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
              Any of these true for your family?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Pick all that apply
            </p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-32">
            {displayConditions.map((condition) => (
              <button
                key={condition.text}
                type="button"
                onClick={() => toggleCondition(condition.text)}
                className={`w-full py-4 px-6 rounded-2xl border-2 transition-all duration-300 font-outfit text-left shadow-sm hover:shadow-md ${
                  selectedConditions.includes(condition.text)
                    ? 'border-accent bg-accent/5 text-accent shadow-accent/10'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl" role="img" aria-label="family history emoji">
                      {condition.emoji}
                    </span>
                    <div className="text-left">
                      <div className="text-lg leading-relaxed">
                        {condition.text}
                      </div>
                      {condition.subtext && (
                        <div className="text-sm text-gray-500 mt-1">
                          {condition.subtext}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedConditions.includes(condition.text) && (
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