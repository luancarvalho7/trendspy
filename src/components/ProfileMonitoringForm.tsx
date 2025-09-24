import React, { useState } from 'react';
import { useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

// Profile type definition
interface Profile {
  text: string;
  niche?: string;
  type: 'aiRecommend' | 'manualAdded';
}

export default function ProfileMonitoringForm({ onContinue, formData }: FormStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(formData?.profileMonitoring || '');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [showProfilesList, setShowProfilesList] = useState(false);
  const [maxProfiles, setMaxProfiles] = useState(3);

  // Get max profiles based on localStorage plan
  useEffect(() => {
    try {
      const plan = localStorage.getItem('plan');
      switch (plan) {
        case '1a':
          setMaxProfiles(3);
          break;
        case '1b':
          setMaxProfiles(5);
          break;
        case '1c':
          setMaxProfiles(Infinity);
          break;
        default:
          setMaxProfiles(3);
          break;
      }
    } catch (error) {
      console.warn('Failed to read plan from localStorage:', error);
      setMaxProfiles(3);
    }
  }, []);

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
      const response = await fetch('https://webhook.workez.online/webhook/trendspy/lander/findTargetes', {
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
        
        // Extract profiles from webhook response: {"arr": ["@profile1", "@profile2"]}
        let suggestedProfiles = [];
        if (Array.isArray(responseData)) {
          suggestedProfiles = responseData.map(profileObj => ({
            text: profileObj.username, // username already without @
            niche: profileObj.niche, // Store niche for display
            type: 'aiRecommend'
          }));
        }

        // Show the suggested profiles list
        setSuggestedProfiles(suggestedProfiles);
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

  const handleToggleProfile = (profile: Profile) => {
    const isSelected = selectedProfiles.some(p => p.text === profile.text);
    
    if (isSelected) {
      // Remove from selected
      setSelectedProfiles(selectedProfiles.filter(p => p.text !== profile.text));
    } else {
      // Add to selected if under limit
      const isUnlimited = maxProfiles === Infinity;
      if (isUnlimited || selectedProfiles.length < maxProfiles) {
        setSelectedProfiles([...selectedProfiles, profile]);
      }
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedProfiles(selectedProfiles.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        profileMonitoring: selectedAnswer,
        profilesToMonitor: selectedProfiles
      });
    }
  };

  const isUnlimited = maxProfiles === Infinity;
  const maxText = isUnlimited ? 'ilimitado' : maxProfiles.toString();

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        {!showProfilesList ? (
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
        ) : (
          <div className="flex flex-col h-full">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
                Selecione os perfis que deseja monitorar
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Toque para selecionar (máximo {maxText})
              </p>
            </div>

            {/* Selected Profiles */}
            {selectedProfiles.length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-3">
                  Selecionados ({selectedProfiles.length}/{maxText}):
                </div>
                <div className="space-y-2">
                  {selectedProfiles.map((profile, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-xl"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-accent font-medium">@</span>
                        <div>
                          <div className="text-accent font-medium">{profile.text}</div>
                          {profile.niche && (
                            <div className="text-xs text-accent/70">{profile.niche}</div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelected(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Profiles */}
            <div className="flex-1">
              {suggestedProfiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Sugestões baseadas no seu nicho ⭐:
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {suggestedProfiles.map((profile, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleToggleProfile(profile)}
                        disabled={!isUnlimited && selectedProfiles.length >= maxProfiles && !selectedProfiles.some(p => p.text === profile.text)}
                        className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedProfiles.some(p => p.text === profile.text)
                            ? 'bg-accent/10 border-accent text-accent'
                            : (!isUnlimited && selectedProfiles.length >= maxProfiles)
                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">@</span>
                          <div>
                            <div className="font-medium">{profile.text}</div>
                            {profile.niche && (
                              <div className="text-xs opacity-70">{profile.niche}</div>
                            )}
                          </div>
                          <div className="flex-1"></div>
                          {selectedProfiles.some(p => p.text === profile.text) ? (
                            <div className="text-accent">✓</div>
                          ) : (
                            <div className="opacity-50">
                              ⭐
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">Nenhum perfil sugerido encontrado</div>
                  <div className="text-sm text-gray-400">Você pode adicionar perfis manualmente na próxima etapa</div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit bg-black hover:bg-gray-800 active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}