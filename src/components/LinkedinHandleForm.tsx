import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function LinkedinHandleForm({ onContinue, formData }: FormStepProps) {
  const [linkedinHandle, setLinkedinHandle] = useState(formData?.linkedinHandle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkedinHandle.trim() && isValidLinkedinHandle()) {
      if (onContinue) {
        onContinue({ linkedinHandle: linkedinHandle.trim() });
      }
    }
  };

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove @ symbol if user types it and allow letters, numbers, dots, underscores, hyphens
    const cleanValue = value.replace(/^@/, '');
    if (/^[a-zA-Z0-9._-]*$/.test(cleanValue) && cleanValue.length <= 50) {
      setLinkedinHandle(cleanValue);
    }
  };

  const isValidLinkedinHandle = () => {
    const trimmed = linkedinHandle.trim();
    return trimmed.length >= 1 && trimmed.length <= 50 && /^[a-zA-Z0-9._-]+$/.test(trimmed);
  };

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
              Qual o seu LinkedIn?
            </h1>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg 
                  className="w-5 h-5 mr-2 text-[#0077B5]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              <input
                type="text"
                value={linkedinHandle}
                onChange={handleLinkedinChange}
                className="w-full pr-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                maxLength={50}
                autoFocus
                placeholder="seu-perfil-linkedin"
              />              </div>
            </div>
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidLinkedinHandle()}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidLinkedinHandle()
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