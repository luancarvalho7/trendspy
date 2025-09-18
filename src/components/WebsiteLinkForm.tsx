import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WebsiteLinkForm({ onContinue, formData }: FormStepProps) {
  const [websiteLink, setWebsiteLink] = useState(formData?.websiteLink || 'https://');

  const handleWebsiteLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If user types or pastes https://, remove the duplicate
    if (value.startsWith('https://https://')) {
      setWebsiteLink(value.replace('https://https://', 'https://'));
    } else if (value.startsWith('http://https://')) {
      setWebsiteLink(value.replace('http://https://', 'https://'));
    } else if (value.startsWith('https://http://')) {
      setWebsiteLink(value.replace('https://http://', 'https://'));
    } else {
      // Ensure it always starts with https://
      if (!value.startsWith('https://')) {
        setWebsiteLink('https://' + value.replace(/^https?:\/\//, ''));
      } else {
        setWebsiteLink(value);
      }
    }
  };

  const isValidWebsiteLink = () => {
    const trimmed = websiteLink.trim();
    if (trimmed.length <= 10) return false; // Must be more than just "https://"
    
    // Basic URL validation - must start with https:// and have valid domain
    const urlPattern = /^https:\/\/[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*([\/\w\.\-\?\&\%\#\=]*)*\/?$/i;
    return urlPattern.test(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteLink.trim() && isValidWebsiteLink() && onContinue) {
      onContinue({ websiteLink: websiteLink.trim() });
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              Qual o link do site?
            </h1>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <input
              type="url"
              value={websiteLink}
              onChange={handleWebsiteLinkChange}
              className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
              autoFocus
              placeholder="https://www.seusite.com.br"
            />
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