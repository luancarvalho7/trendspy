import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

// Profile type definition
interface Profile {
  text: string;
  niche?: string;
  type: 'aiRecommend' | 'manualAdded';
}

export default function TargetsForm({ onContinue, formData }: FormStepProps) {
  // Get AI suggested profiles if they exist
  const getInitialProfiles = (): Profile[] => {
    const profiles: Profile[] = [];
    
    // Add AI suggested profiles if they exist
    if (formData?.aiSuggestedProfiles && formData.aiSuggestedProfiles.length > 0) {
      profiles.push(...formData.aiSuggestedProfiles);
    }
    
    // Add existing manually added profiles if they exist
    if (formData?.profilesToMonitor && formData.profilesToMonitor.length > 0) {
      const existingProfiles = formData.profilesToMonitor.map(profile => {
        if (typeof profile === 'string') {
          return { text: profile, type: 'manualAdded' as const };
        }
        return profile;
      });
      profiles.push(...existingProfiles);
    }
    
    return profiles;
  };
  
  // Check if we have profiles from webhook analysis, otherwise use existing profiles
  const [profiles, setProfiles] = useState<Profile[]>(getInitialProfiles());
  const [currentProfile, setCurrentProfile] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [maxProfiles, setMaxProfiles] = useState(3); // Default to plan 1a

  // React to formData changes (e.g., when coming from webhook analysis)
  useEffect(() => {
    const newProfiles = getInitialProfiles();
    // Only update if we have new profiles and they're different from current ones
    if (newProfiles.length > 0 && 
        JSON.stringify(newProfiles.map(p => ({ text: p.text, type: p.type }))) !== 
        JSON.stringify(profiles.map(p => ({ text: p.text, type: p.type })))) {
      setProfiles(newProfiles);
    }
  }, [formData?.aiSuggestedProfiles, formData?.profilesToMonitor]);
  
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
          setMaxProfiles(Infinity); // Unlimited
          break;
        default:
          setMaxProfiles(3); // Default to plan 1a
          break;
      }
    } catch (error) {
      console.warn('Failed to read plan from localStorage:', error);
      setMaxProfiles(3);
    }
  }, []);

  const handleAddProfile = () => {
    const trimmedProfile = currentProfile.trim();
    if (trimmedProfile && !profiles.some(p => p.text === trimmedProfile) && profiles.length < maxProfiles) {
      setProfiles([...profiles, { text: trimmedProfile, type: 'manualAdded' }]);
      setCurrentProfile('');
    }
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
    // Cancel editing if we're removing the profile being edited
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleEditProfile = (index: number) => {
    // Don't allow editing of AI-recommended profiles
    if (profiles[index].type === 'aiRecommend') {
      return;
    }
    setEditingIndex(index);
    setEditingValue(profiles[index].text);
  };

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editingValue.trim();
    if (trimmedValue && !profiles.some((profile, i) => i !== index && profile.text === trimmedValue)) {
      const updatedProfiles = [...profiles];
      updatedProfiles[index] = { ...updatedProfiles[index], text: trimmedValue };
      setProfiles(updatedProfiles);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(index);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove @ symbol if user types it and allow letters, numbers, dots, underscores
    const cleanValue = value.replace(/^@/, '');
    if (/^[a-zA-Z0-9._]*$/.test(cleanValue) && cleanValue.length <= 30) {
      setEditingValue(cleanValue);
    }
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
            {formData?.aiSuggestedProfiles && formData.aiSuggestedProfiles.length > 0 ? (
              <p className="text-sm text-purple-600 mt-2">
                ⭐ Sugestões baseadas no seu nicho + adicione outros manualmente (máximo {maxText})
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Digite um @ e pressione Enter para adicionar (máximo {maxText})
              </p>
            )}
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
                disabled={!currentProfile.trim() || profiles.some(p => p.text === currentProfile.trim()) || (!isUnlimited && profiles.length >= maxProfiles)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  currentProfile.trim() && !profiles.some(p => p.text === currentProfile.trim()) && (isUnlimited || profiles.length < maxProfiles)
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
                {profiles.some(p => p.type === 'aiRecommend') && (
                  <p className="text-sm text-purple-600 mb-2">
                    ⭐ Perfis sugeridos baseados no seu nicho
                  </p>
                )}
                <div className={`space-y-2 ${isUnlimited ? 'max-h-64 overflow-y-auto pr-2' : ''}`}>
                  {profiles.map((profile, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        profile.type === 'aiRecommend' 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-accent/5 border-accent/20'
                      }`}
                    >
                      {editingIndex === index ? (
                        // Edit mode (only for manual profiles)
                        <>
                          <div className="flex items-center space-x-2 flex-1 mr-2">
                            <span className="text-accent font-medium">@</span>
                            <input
                              type="text"
                              value={editingValue}
                              onChange={handleEditChange}
                              onKeyDown={(e) => handleEditKeyPress(e, index)}
                              className="flex-1 px-2 py-1 text-accent font-medium bg-white border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                              maxLength={30}
                              autoFocus
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(index)}
                              className="text-green-500 hover:text-green-700 transition-colors p-1 text-sm"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-700 transition-colors p-1 text-sm"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      ) : (
                        // Display mode
                        <>
                          <div className="flex items-center space-x-2 flex-1">
                            <span className={`font-medium ${profile.type === 'aiRecommend' ? 'text-purple-600' : 'text-accent'}`}>@</span>
                            <div>
                              <div className={`font-medium ${profile.type === 'aiRecommend' ? 'text-purple-600' : 'text-accent'}`}>{profile.text}</div>
                              {profile.niche && profile.type === 'aiRecommend' && (
                                <div className="text-xs text-purple-500">{profile.niche}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {profile.type === 'aiRecommend' ? (
                              <>
                                <div className="text-purple-500 p-1" title="AI Suggested">
                                  ⭐
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProfile(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditProfile(index)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors p-1 text-sm"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProfile(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
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