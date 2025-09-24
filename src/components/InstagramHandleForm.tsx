import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function InstagramHandleForm({ onContinue, formData }: FormStepProps) {
  const [instagramHandle, setInstagramHandle] = useState(formData?.instagramHandle || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (instagramHandle.trim() && isValidInstagramHandle()) {
      setIsLoading(true);
      
      try {
        const response = await fetch('https://webhook.workez.online/webhook/trends/lander/getUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            instagramHandle: instagramHandle.trim()
          })
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('User profile metrics:', responseData);
          
          // Check if we got a successful response with valid data
          if (responseData && responseData.length > 0 && responseData[0].success === true) {
            // Continue with the response data
            onContinue({ 
              instagramHandle: instagramHandle.trim(),
              userProfileMetrics: responseData
            });
          } else {
            // Profile not found or invalid response
            console.error('Invalid profile data or profile not found:', responseData);
            // Show error message or continue anyway
            if (onContinue) {
              onContinue({ 
                instagramHandle: instagramHandle.trim(),
                userProfileMetrics: responseData,
                profileError: true
              });
            }
          }
        } else {
          console.error('User profile request failed:', response.status, response.statusText);
          // Continue anyway with just the handle
          if (onContinue) {
            onContinue({ instagramHandle: instagramHandle.trim() });
          }
        }
      } catch (error) {
        console.error('User profile request error:', error);
        // Continue anyway with just the handle
        if (onContinue) {
          onContinue({ instagramHandle: instagramHandle.trim() });
        }
      } finally {
        setIsLoading(false);
      }
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
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              Qual o @ do seu perfil no instagram?
            </h1>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            {isLoading ? (
              <div className="w-full py-8 text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="text-lg text-gray-600 font-outfit">
                    Buscando dados do perfil...
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <img 
                    src="https://cdn.iconscout.com/icon/free/png-256/free-instagram-logo-icon-svg-download-png-1646407.png" 
                    alt="Instagram" 
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-lg text-gray-600 font-outfit">@</span>
                </div>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={handleInstagramChange}
                  className="w-full pl-16 pr-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                  maxLength={30}
                  autoFocus
                  placeholder="seu_usuario_instagram"
                />
              </div>
            )}
          </div>

          {/* Bottom Section with Button */}
          {!isLoading && (
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
          )}
        </form>
      </div>
    </div>
  );
}