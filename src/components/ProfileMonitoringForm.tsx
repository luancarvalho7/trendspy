import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

// Profile type definition
interface Profile {
  text: string;
  type: 'aiRecommend' | 'manualAdded';
}

export default function ProfileMonitoringForm({ onContinue, formData }: FormStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(formData?.profileMonitoring || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfilesList, setShowProfilesList] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (answer === 'Não') {
      // Send POST request to webhook
      handleNoSelection(answer);
    } else {
      // Auto-forward after a brief delay for visual feedback (for "Sim")
      setTimeout(() => {
        if (onContinue) {
          onContinue({ profileMonitoring: answer });
        }
      }, 300);
    }
  };

  const handleNoSelection = async (answer: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://webhook.workez.online/webhook/trendspy/lander/findTargets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profileMonitoring: answer
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Webhook response:', responseData);
        
        // Extract profiles from webhook response and format them as AI-recommended
        let profiles: Profile[] = [];
        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].arr) {
          profiles = responseData[0].arr.map((profile: string) => ({
            text: profile.replace('@', ''), // Remove @ if present
            type: 'aiRecommend' as const
          }));
        }

        // Show the profiles list instead of navigating
        setSuggestedProfiles(profiles);
        setShowProfilesList(true);
      } else {
        console.error('Webhook request failed:', response.status, response.statusText);
        // Show empty list on error
        setSuggestedProfiles([]);
        setShowProfilesList(true);
      }
    } catch (error) {
      console.error('Webhook request error:', error);
      // Show empty list on error
      setSuggestedProfiles([]);
      setShowProfilesList(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProfile = (index: number) => {
    setSuggestedProfiles(suggestedProfiles.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        profileMonitoring: selectedAnswer,
        profilesToMonitor: suggestedProfiles
      });
    }
  };

  // If showing profiles list
  if (showProfilesList) {
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
                Perfis sugeridos para monitorar:
              </h1>
              {suggestedProfiles.length > 0 && (
                <p className="text-sm text-purple-600 mt-2">
                  ⭐ Baseado no seu nicho e perfil
                </p>
              )}
            </div>

            {/* Profiles List */}
            <div className="flex-1 pb-20">
              {suggestedProfiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Perfis sugeridos ({suggestedProfiles.length}):
                  </div>
                  <div className="space-y-2">
                    {suggestedProfiles.map((profile, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-xl"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-purple-500 p-1" title="AI Suggested">
                            ⭐
                          </span>
                          <span className="text-purple-600 font-medium">@</span>
                          <span className="text-purple-600 font-medium">{profile.text}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProfile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">
                    Nenhum perfil sugerido encontrado
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section with Continue Button */}
        <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
          <button
            onClick={handleContinue}
            className="w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit bg-black hover:bg-gray-800 active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

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
              Você já sabe quais perfis quer monitorar?
            </h1>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 pb-20">
            {isLoading ? (
              <div className="w-full py-8 text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="text-lg text-gray-600 font-outfit">
                    Buscando perfis para você...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAnswerSelection('Sim')}
                  className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                    selectedAnswer === 'Sim'
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                  }`}
                >
                  Sim
                </button>
                
                <button
                  type="button"
                  onClick={() => handleAnswerSelection('Não')}
                  className={`w-full py-4 px-6 text-lg rounded-2xl border-2 transition-all duration-200 font-outfit text-left ${
                    selectedAnswer === 'Não'
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-[#CFCFCF] text-gray-900 hover:border-accent'
                  }`}
                >
                  Não
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}