import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function InstagramConfirmationForm({ onContinue, formData }: FormStepProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Get the profile data from the previous step
  const profileData = formData?.userProfileMetrics;

  console.log(profileData.verified)

  const handleChange = () => {
    // Go back to the Instagram handle form
    window.history.back();
  };
  
  // If no profile data or success is not true, show error state
  if (!profileData || profileData.success !== true) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-outfit">
        <div className="pt-12 pb-16 px-6">
          <Logo />
        </div>
        
        <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full justify-center items-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-medium text-gray-900">
              Perfil não encontrado
            </h1>
            <p className="text-gray-600">
              Não conseguimos encontrar este perfil do Instagram. Verifique o nome de usuário e tente novamente.
            </p>
            <button
              onClick={handleChange}
              className="w-full py-4 px-6 rounded-full font-medium text-white bg-accent hover:bg-accent/90 transition-all duration-200"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      if (onContinue) {
        onContinue({ profileConfirmed: true });
      }
    }, 300);
  };

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  };

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
              Este é o seu perfil?
            </h1>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=?';
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-900">
                  {profileData.name}
                </div>
                <div className="text-accent font-medium">
                  <div className="flex items-center space-x-1">
                    <span>@{profileData.username}</span>
                    {profileData.verified == true && (
                      <svg 
                        className="w-4 h-4 text-blue-500 fill-current" 
                        viewBox="0 0 20 20"
                        aria-label="Verified account"
                      >
                        <path d="M10 0L12.09 3.09L16 2L15.55 6.55L20 8L16.91 10.91L18 15L13.45 13.45L10 16L6.55 13.45L2 15L3.09 10.91L0 8L4.45 6.55L4 2L7.91 3.09L10 0Z" />
                        <path d="M7.5 10L9 11.5L12.5 8" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">
                  {formatNumber(profileData.media)}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">
                  {formatNumber(profileData.followers)}
                </div>
                <div className="text-sm text-gray-600">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">
                  {formatNumber(profileData.following)}
                </div>
                <div className="text-sm text-gray-600">Seguindo</div>
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {profileData.bio.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3 pb-20">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`w-full py-4 px-6 text-lg rounded-2xl font-medium transition-all duration-200 font-outfit ${
                isConfirming
                  ? 'bg-accent/70 text-white cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90 active:scale-95'
              }`}
            >
              {isConfirming ? 'Confirmando...' : 'Sim, esse é meu perfil'}
            </button>
            
            <button
              type="button"
              onClick={handleChange}
              disabled={isConfirming}
              className={`w-full py-4 px-6 text-lg rounded-2xl border-2 font-medium transition-all duration-200 font-outfit ${
                isConfirming
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-accent hover:text-accent'
              }`}
            >
              Não, quero alterar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}