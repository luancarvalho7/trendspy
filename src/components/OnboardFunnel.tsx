import React, { useState } from 'react';
import { FormData } from '../types/form';
import { onboardConfig, findOnboardStepById, getOnboardFirstStep } from '../config/onboardConfig';
import Phase1LoadingPage from './Phase1LoadingPage';

// localStorage key for onboard form data
const ONBOARD_DATA_STORAGE_KEY = 'prevent-quiz-onboard-data';

// Helper functions for localStorage
const saveOnboardDataToStorage = (data: FormData) => {
  try {
    localStorage.setItem(ONBOARD_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save onboard data to localStorage:', error);
  }
};

const loadOnboardDataFromStorage = (): FormData => {
  try {
    const stored = localStorage.getItem(ONBOARD_DATA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load onboard data from localStorage:', error);
    return {};
  }
};

export default function OnboardFunnel() {
  // State management
  const [formData, setFormData] = useState<FormData>(loadOnboardDataFromStorage());
  const [currentStepId, setCurrentStepId] = useState<string>(getOnboardFirstStep().id);
  const [history, setHistory] = useState<string[]>([]); // Track visited steps for back navigation
  
  // Development state
  const [showDevNavigation, setShowDevNavigation] = useState(false);

  // Get current step configuration
  const getCurrentStep = () => {
    return findOnboardStepById(currentStepId);
  };

  // Handle form submission from current step
  const handleContinue = (stepData: any) => {
    const currentStep = getCurrentStep();
    if (!currentStep) return;

    // Update form data with new step data
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    saveOnboardDataToStorage(updatedFormData);

    // Add current step to history before moving to next
    setHistory(prev => [...prev, currentStepId]);

    // Determine next step using the step's logic
    const nextStepId = currentStep.nextStepLogic(updatedFormData);

    if (nextStepId === null) {
      // This shouldn't happen in onboard funnel, but handle gracefully
      console.log('Onboard funnel complete');
    } else {
      // Navigate to next step
      const nextStep = findOnboardStepById(nextStepId);
      if (nextStep) {
        setCurrentStepId(nextStepId);
      } else {
        console.error(`Next step with ID "${nextStepId}" not found in onboard configuration`);
      }
    }
  };

  // Handle completion of phase 1 loading animation
  const handlePhase1LoadingComplete = () => {
    // Redirect to external login URL
    window.location.href = 'https://carrossel-de-cria-bolt.vercel.app';
  };

  // Handle back navigation
  const handleBack = () => {
    if (history.length === 0) return;

    // Get the previous step from history
    const newHistory = [...history];
    const previousStepId = newHistory.pop();
    
    if (previousStepId) {
      setHistory(newHistory);
      setCurrentStepId(previousStepId);
    }
  };

  // Check if back button should be shown
  const canGoBack = () => {
    return history.length > 0;
  };

  // Development helper function to jump to any step
  const jumpToStep = (stepId: string) => {
    // Set new current step
    setCurrentStepId(stepId);
    
    // Clear history for clean navigation
    setHistory([]);
    
    // Save current form data when jumping (for development)
    saveOnboardDataToStorage(formData);
    
    // Hide the navigation dropdown
    setShowDevNavigation(false);
  };

  // Render the current step component
  const renderCurrentStep = () => {
    // Handle Phase 1 Loading specially
    if (currentStepId === 'phase1_loading') {
      return (
        <Phase1LoadingPage 
          formData={formData} 
          onComplete={handlePhase1LoadingComplete}
        />
      );
    }

    const currentStep = getCurrentStep();
    if (!currentStep) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-outfit px-6">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-red-600 mb-4">
              Error: Step Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              Step "{currentStepId}" is not defined in the onboard configuration.
            </p>
            <button
              onClick={() => {
                setCurrentStepId(getOnboardFirstStep().id);
                setHistory([]);
                setFormData({});
                localStorage.removeItem(ONBOARD_DATA_STORAGE_KEY);
              }}
              className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Reset Onboard
            </button>
          </div>
        </div>
      );
    }

    // Render the step's component with the required props
    const StepComponent = currentStep.component;
    return (
      <StepComponent 
        onContinue={handleContinue} 
        formData={formData}
      />
    );
  };

  return (
    <div className="relative">
      {renderCurrentStep()}
      
      {/* Back Button - Only show when navigation is possible */}
      {canGoBack() && (
        <button
          onClick={handleBack}
          className="fixed top-12 left-6 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 z-10"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Development Helper - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs font-mono z-20 max-w-xs">
          <div className="text-blue-300 font-bold mb-1">ONBOARD FUNNEL</div>
          <div>Step: {currentStepId}</div>
          <div>History: {history.length}</div>
          
          {/* Step Navigation */}
          <div className="mt-3 border-t border-gray-600 pt-2">
            <button
              onClick={() => setShowDevNavigation(!showDevNavigation)}
              className="text-blue-300 hover:text-blue-200 underline text-xs"
            >
              {showDevNavigation ? 'Hide' : 'Jump to Step'}
            </button>
            
            {showDevNavigation && (
              <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 rounded p-2">
                <div className="mb-2 text-gray-300 font-bold">Onboard Steps:</div>
                {onboardConfig.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => jumpToStep(step.id)}
                    className={`block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded mb-1 ${
                      currentStepId === step.id ? 'bg-blue-600' : ''
                    }`}
                  >
                    {step.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}