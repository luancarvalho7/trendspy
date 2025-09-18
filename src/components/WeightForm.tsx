import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WeightForm({ onContinue, formData }: FormStepProps) {
  const [instagramHandle, setInstagramHandle] = useState(formData?.instagramHandle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instagramHandle.trim() && isValidInstagramHandle() && onContinue) {
      onContinue({ instagramHandle: instagramHandle.trim() });
    }
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove @ symbol if user types it and allow letters, numbers, dots, underscores
    const cleanValue = value.replace(/^@/, '');
    if (/^[a-zA-Z0-9._]*$/.test(cleanValue) && cleanValue.length <= 30) {
      setInstagramHandle(cleanValue);
    }
  };

  const isValidInstagramHandle = () => {
    const trimmed = instagramHandle.trim();
    return trimmed.length >= 1 && trimmed.length <= 30 && /^[a-zA-Z0-9._]+$/.test(trimmed);
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
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://cdn.iconscout.com/icon/free/png-256/free-instagram-logo-icon-svg-download-png-1646407.png" 
                alt="Instagram" 
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-medium text-gray-900 font-outfit">
                Qual o @ do seu perfil no instagram?
              </h1>
            </div>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-lg text-gray-600 font-outfit">@</span>
              </div>
              <input
                type="text"
                value={instagramHandle}
                onChange={handleInstagramChange}
                className="w-full pl-10 pr-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                maxLength={30}
                autoFocus
                placeholder="seu_usuario_instagram"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Digite seu nome de usuário do Instagram (sem o @)
            </p>
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidInstagramHandle()}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidInstagramHandle()
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