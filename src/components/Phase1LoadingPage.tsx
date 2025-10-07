import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormData } from '../types/form';

interface Phase1LoadingPageProps {
  formData: FormData;
  onComplete: () => void;
}

export default function Phase1LoadingPage({ formData, onComplete }: Phase1LoadingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Salvando informações...",
    "Inicializando Feed...", 
    "Personalizando..."
  ];

  useEffect(() => {
    // Duration of about 4 seconds total
    const totalDuration = 4000;
    const stepDuration = totalDuration / steps.length;

    const intervals: NodeJS.Timeout[] = [];

    steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
      }, stepDuration * index);
      intervals.push(timeout);
    });

    // Complete after all steps
    const completeTimeout = setTimeout(() => {
      // In onboard funnel, this should trigger redirect to login
      // The onComplete handler in OnboardFunnel will handle the redirect
      onComplete();
    }, totalDuration);
    intervals.push(completeTimeout);

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-16 pb-20 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-md mx-auto w-full justify-center">
        <div className="space-y-10 text-center">
          
          {/* Progress Indicator */}
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
            
            {/* Current Step Text */}
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-gray-900 font-outfit">
                {steps[currentStep]}
              </h1>
              
              {/* Step Progress Dots */}
              <div className="flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-accent' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Phase Transition Message */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Fase 1 Completa!
            </h2>
            <p className="text-gray-600 text-sm">
              Preparando para a próxima etapa: definir o tom de voz da sua marca
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}