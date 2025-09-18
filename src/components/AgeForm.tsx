import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function AgeForm({ onContinue, formData }: FormStepProps) {
  const [age, setAge] = useState(formData?.age || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age.trim() && onContinue) {
      onContinue({ age });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 150))) {
      setAge(value);
    }
  };

  const isValidAge = age && parseInt(age) >= 1 && parseInt(age) <= 150;

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
              How old are you today?
            </h1>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <input
              type="text"
              value={age}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
              maxLength={3}
              inputMode="numeric"
              autoFocus
              placeholder="Enter your age"
            />
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidAge}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidAge
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