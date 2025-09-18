import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WebsiteLinkForm({ onContinue, formData }: FormStepProps) {
  const [websiteLink, setWebsiteLink] = useState(formData?.websiteLink || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteLink.trim() && isValidWebsiteLink() && onContinue) {
      onContinue({ websiteLink: websiteLink.trim() });
    }
  };

  const handleWebsiteLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteLink(value);
  };

  const isValidWebsiteLink = () => {
    const trimmed = websiteLink.trim();
    if (trimmed.length < 3) return false;
    
    // Basic URL validation - check if it starts with http(s) or is a valid domain
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlPattern.test(trimmed);
  };

  const formatWebsiteLink = (link: string) => {
    const trimmed = link.trim();
    if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteLink.trim() && isValidWebsiteLink() && onContinue) {
      const formattedLink = formatWebsiteLink(websiteLink);
      onContinue({ websiteLink: formattedLink });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              Qual o link do site?
            </h1>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-lg text-gray-600 font-outfit">🌐</span>
              </div>
              <input
                type="url"
                value={websiteLink}
                onChange={handleWebsiteLinkChange}
                className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                autoFocus
                placeholder="www.seusite.com.br"
              />
            </div>
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidWebsiteLink()}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidWebsiteLink()
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