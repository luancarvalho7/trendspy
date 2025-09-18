import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function FamilyHistoryForm({ onContinue, formData }: FormStepProps) {
  const [profiles, setProfiles] = useState<string[]>(formData?.profilesToMonitor || []);
  const [currentProfile, setCurrentProfile] = useState('');
  const [maxProfiles, setMaxProfiles] = useState(3); // Default to plan 1a

  // Get max profiles based on localStorage plan
  useEffect(() => {
    try {
      const currentPlan = localStorage.getItem('current_plan');
      switch (currentPlan) {
        case '1a':
          setMaxProfiles(3);
          break;
        case '1b':
          setMaxProfiles(5);
          break;
        case '1c':
          setMaxProfiles(Infinity); // Unlimited
          break;
        default:
          setMaxProfiles(3); // Default to plan 1a
          break;
      }
    } catch (error) {
      console.warn('Failed to read current_plan from localStorage:', error);
      setMaxProfiles(3);
    }
  }, []);

  const handleAddProfile = () => {
    const trimmedProfile = currentProfile.trim();
    if (trimmedProfile && !profiles.includes(trimmedProfile) && profiles.length < maxProfiles) {
      setProfiles([...profiles, trimmedProfile]);
      setCurrentProfile('');
    }
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProfile();
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove @ symbol if user types it and allow letters, numbers, dots, underscores
    const cleanValue = value.replace(/^@/, '');
    if (/^[a-zA-Z0-9._]*$/.test(cleanValue) && cleanValue.length <= 30) {
      setCurrentProfile(cleanValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profiles.length > 0 && onContinue) {
      onContinue({ profilesToMonitor: profiles });
    }
  };

  const isValidToSubmit = profiles.length > 0;
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              Adicione os perfis que você quer monitorar
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Digite um @ e pressione Enter para adicionar (máximo {maxText})
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-lg text-gray-600 font-outfit">@</span>
                </div>
                <input
                  type="text"
                  value={currentProfile}
                  onChange={handleProfileChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                  placeholder="perfil_para_monitorar"
                  maxLength={30}
                  disabled={!isUnlimited && profiles.length >= maxProfiles}
                />
              </div>
              <button
                type="button"
                onClick={handleAddProfile}
                disabled={!currentProfile.trim() || profiles.includes(currentProfile.trim()) || (!isUnlimited && profiles.length >= maxProfiles)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  currentProfile.trim() && !profiles.includes(currentProfile.trim()) && (isUnlimited || profiles.length < maxProfiles)
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Added Profiles */}
          <div className="flex-1">
            {profiles.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Perfis adicionados ({profiles.length}/{maxText}):
                </div>
                <div className="space-y-2">
                  {profiles.map((profile, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-accent font-medium">@</span>
                        <span className="text-accent font-medium">{profile}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProfile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidToSubmit}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidToSubmit
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