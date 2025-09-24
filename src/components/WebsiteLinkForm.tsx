import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WebsiteLinkForm({ onContinue, formData }: FormStepProps) {
  const [websiteLink, setWebsiteLink] = useState(formData?.websiteLink || 'https://');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteLink.trim() && isValidWebsiteLink()) {
      setIsLoading(true);
      
      try {
        const response = await fetch('https://webhook.workez.online/webhook/trends/lander/analyzeWebsite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            websiteLink: websiteLink.trim()
          })
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Website analysis response:', responseData);
          
          // Handle the response which is an array with niches data
          let extractedNiches = [];
          if (Array.isArray(responseData) && responseData.length > 0 && responseData.success === true) {
            extractedNiches = responseData.niches || [];
          }
          
          // Continue with the response data
          if (onContinue) {
            onContinue({ 
              websiteLink: websiteLink.trim(),
              websiteAnalysis: responseData,
              niches: extractedNiches.length > 0 ? extractedNiches : undefined
            });
          }
        } else {
          console.error('Website analysis request failed:', response.status, response.statusText);
          // Continue anyway with just the website link
          if (onContinue) {
            onContinue({ websiteLink: websiteLink.trim() });
          }
        }
      } catch (error) {
        console.error('Website analysis request error:', error);
        // Continue anyway with just the website link
        if (onContinue) {
          onContinue({ websiteLink: websiteLink.trim() });
        }
      } finally {
        setIsLoading(false);
      }
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
            {isLoading ? (
              <div className="w-full py-8 text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="text-lg text-gray-600 font-outfit">
                    Analisando website...
                  </span>
                </div>
              </div>
            ) : (
              <input
                type="url"
                value={websiteLink}
                onChange={handleWebsiteLinkChange}
                className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                autoFocus
                placeholder="https://www.seusite.com.br"
              />
            )}
          </div>

          {/* Bottom Section with Button */}
          {!isLoading && (
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
          )}
        </form>
      </div>
    </div>
  );
}