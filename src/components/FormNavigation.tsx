import React, { useState } from 'react';
import { FormData } from '../types/form';
import { formConfig, findStepById, getFirstStep } from '../formConfig';
import LoadingPage from './LoadingPage';
import ResultsPage from './ResultsPage';
import Phase1LoadingPage from './Phase1LoadingPage';

// localStorage key for form data
const FORM_DATA_STORAGE_KEY = 'prevent-quiz-responses';

// Helper functions for localStorage
const saveFormDataToStorage = (data: FormData) => {
  try {
    localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

const loadFormDataFromStorage = (): FormData => {
  try {
    const stored = localStorage.getItem(FORM_DATA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error);
    return {};
  }
};

const clearFormDataFromStorage = () => {
  try {
    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
};

export default function FormNavigation() {
  // State management
  const [formData, setFormData] = useState<FormData>(loadFormDataFromStorage());
  const [currentStepId, setCurrentStepId] = useState<string>(getFirstStep().id);
  const [history, setHistory] = useState<string[]>([]); // Track visited steps for back navigation
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic sub-flow state for hormone therapy
  const [isDynamicSubFlowActive, setIsDynamicSubFlowActive] = useState(false);
  const [dynamicMedicationQueue, setDynamicMedicationQueue] = useState<string[]>([]);
  const [currentDynamicMedication, setCurrentDynamicMedication] = useState<string | null>(null);
  const [dynamicSubStepIndex, setDynamicSubStepIndex] = useState(0); // 0: HT2, 1: HT3, 2: HT4
  const [dynamicHistory, setDynamicHistory] = useState<Array<{medication: string, stepIndex: number}>>([]);

  // Development state
  const [showDevNavigation, setShowDevNavigation] = useState(false);

  // Get current step configuration
  const getCurrentStep = () => {
    if (isDynamicSubFlowActive) {
      const subSteps = ['ht2', 'ht3', 'ht4'];
      const stepId = subSteps[dynamicSubStepIndex];
      return findStepById(stepId);
    }
    return findStepById(currentStepId);
  };

  // Handle form submission from current step
  const handleContinue = (stepData: any) => {
    const currentStep = getCurrentStep();
    if (!currentStep) return;

    // Update form data with new step data
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    saveFormDataToStorage(updatedFormData);

    if (isDynamicSubFlowActive) {
      // Handle dynamic sub-flow navigation
      handleDynamicSubFlowContinue(updatedFormData);
    } else {
      // Add current step to history before moving to next
      setHistory(prev => [...prev, currentStepId]);

      // Determine next step using the step's logic
      const nextStepId = currentStep.nextStepLogic(updatedFormData);

      if (nextStepId === 'start_ht_subflow') {
        // Initialize dynamic sub-flow
        startDynamicSubFlow(updatedFormData);
      } else if (nextStepId === null) {
        // Form is complete
        setIsLoading(true);
        // The loading page will call setIsComplete when done
      } else {
        // Navigate to next step
        const nextStep = findStepById(nextStepId);
        if (nextStep) {
          setCurrentStepId(nextStepId);
        } else {
          console.error(`Next step with ID "${nextStepId}" not found in form configuration`);
        }
      }
    }
  };

  // Handle dynamic sub-flow initialization
  const startDynamicSubFlow = (updatedFormData: FormData) => {
    const selectedMedications = updatedFormData.ht1Medications || [];
    if (selectedMedications.length > 0) {
      setIsDynamicSubFlowActive(true);
      setDynamicMedicationQueue([...selectedMedications]);
      setCurrentDynamicMedication(selectedMedications[0]);
      setDynamicSubStepIndex(0);
      setDynamicHistory([]);
    }
  };

  // Handle continue within dynamic sub-flow
  const handleDynamicSubFlowContinue = (updatedFormData: FormData) => {
    if (!currentDynamicMedication) return;

    // Merge medication data properly
    const existingMedData = formData.htMedications?.[currentDynamicMedication] || {};
    const newMedData = updatedFormData.htMedications?.[currentDynamicMedication] || {};
    const mergedFormData = {
      ...updatedFormData,
      htMedications: {
        ...updatedFormData.htMedications,
        [currentDynamicMedication]: {
          ...existingMedData,
          ...newMedData
        }
      }
    };
    setFormData(mergedFormData);
    saveFormDataToStorage(mergedFormData);

    // Add to dynamic history
    setDynamicHistory(prev => [...prev, { medication: currentDynamicMedication, stepIndex: dynamicSubStepIndex }]);

    // Move to next sub-step or next medication
    if (dynamicSubStepIndex < 2) { // Still have more sub-steps for current medication
      setDynamicSubStepIndex(dynamicSubStepIndex + 1);
    } else { // Finished all sub-steps for current medication
      const currentMedIndex = dynamicMedicationQueue.indexOf(currentDynamicMedication);
      if (currentMedIndex < dynamicMedicationQueue.length - 1) {
        // Move to next medication
        setCurrentDynamicMedication(dynamicMedicationQueue[currentMedIndex + 1]);
        setDynamicSubStepIndex(0);
      } else {
        // All medications processed, end dynamic sub-flow
        setIsDynamicSubFlowActive(false);
        
        // After completing all HT questions, check if female for pregnancy
        if (mergedFormData.sex === 'Female') {
          // Add current state to history and go to pregnancy
          setHistory(prev => [...prev, 'ht4']); // Represent the completed HT flow
          setCurrentStepId('pregnancy');
        } else {
          // Male - go to walking question  
          setHistory(prev => [...prev, 'ht4']); // Represent the completed HT flow
          setCurrentStepId('walking');
        }
      }
    }
  };

  // Handle completion of loading animation
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsComplete(true);
    console.log('Complete form data:', formData);
  };

  // Handle completion of phase 1 loading animation
  const handlePhase1LoadingComplete = () => {
    // Continue to next step (mission_selection)
    const currentStep = getCurrentStep();
    if (currentStep) {
      const nextStepId = currentStep.nextStepLogic(formData);
      if (nextStepId) {
        setHistory(prev => [...prev, currentStepId]);
        setCurrentStepId(nextStepId);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (isLoading) {
      // Don't allow back navigation during loading
      return;
    }
    
    if (isComplete) {
      // If we're on the complete screen, go back to last step
      setIsComplete(false);
      if (isDynamicSubFlowActive || dynamicHistory.length > 0) {
        // Reactivate dynamic sub-flow if we were in it
        setIsDynamicSubFlowActive(true);
        if (dynamicHistory.length > 0) {
          const lastDynamicStep = dynamicHistory[dynamicHistory.length - 1];
          setCurrentDynamicMedication(lastDynamicStep.medication);
          setDynamicSubStepIndex(lastDynamicStep.stepIndex);
        }
      }
      return;
    }

    if (isDynamicSubFlowActive) {
      // Handle back navigation within dynamic sub-flow
      if (dynamicHistory.length === 0) {
        // Go back to HT1 form
        setIsDynamicSubFlowActive(false);
        setCurrentDynamicMedication(null);
        setDynamicSubStepIndex(0);
        setDynamicHistory([]);
        // Don't pop from main history as we're going back to HT1
        return;
      }

      // Go back within dynamic sub-flow
      const newDynamicHistory = [...dynamicHistory];
      const previousDynamicStep = newDynamicHistory.pop();
      
      if (previousDynamicStep) {
        setDynamicHistory(newDynamicHistory);
        setCurrentDynamicMedication(previousDynamicStep.medication);
        setDynamicSubStepIndex(previousDynamicStep.stepIndex);
      }
    } else {
      // Handle regular navigation
      if (history.length === 0) return;

      // Get the previous step from history
      const newHistory = [...history];
      const previousStepId = newHistory.pop();
      
      if (previousStepId) {
        setHistory(newHistory);
        setCurrentStepId(previousStepId);
      }
    }
  };

  // Check if back button should be shown
  const canGoBack = () => {
    return (history.length > 0 || isComplete || (isDynamicSubFlowActive && dynamicHistory.length > 0)) && !isLoading;
  };

  // Development helper function to jump to any step
  const jumpToStep = (stepId: string) => {
    // Reset dynamic sub-flow when jumping to a non-dynamic step
    if (!['ht2', 'ht3', 'ht4'].includes(stepId)) {
      setIsDynamicSubFlowActive(false);
      setCurrentDynamicMedication(null);
      setDynamicSubStepIndex(0);
      setDynamicHistory([]);
      setDynamicMedicationQueue([]);
    }
    
    // Reset completion state
    setIsComplete(false);
    
    // Set new current step
    setCurrentStepId(stepId);
    
    // Clear history for clean navigation
    setHistory([]);
    
    // Save current form data when jumping (for development)
    saveFormDataToStorage(formData);
    
    // Hide the navigation dropdown
    setShowDevNavigation(false);
  };

  // Development helper to simulate dynamic sub-flow
  const jumpToDynamicStep = (stepIndex: number, medication: string = 'Estrogen / estradiol') => {
    // Set up dynamic sub-flow state
    setIsDynamicSubFlowActive(true);
    setCurrentDynamicMedication(medication);
    setDynamicSubStepIndex(stepIndex);
    setDynamicMedicationQueue([medication]);
    setDynamicHistory([]);
    setIsComplete(false);
    setHistory(['ht1']); // Simulate coming from HT1
    
    // Set mock form data for dynamic steps
    setFormData(prev => ({
      ...prev,
      ht1Medications: [medication],
      hormoneTherapy: 'Yes'
    }));
    
    // Save updated form data
    saveFormDataToStorage({
      ...formData,
      ht1Medications: [medication],
      hormoneTherapy: 'Yes'
    });
    
    setShowDevNavigation(false);
  };

  // Render the current step component
  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <LoadingPage 
          formData={formData} 
          onComplete={handleLoadingComplete}
        />
      );
    }
    
    // Handle Phase 1 Loading specially
    if (currentStepId === 'phase1_loading') {
      return (
        <Phase1LoadingPage 
          formData={formData} 
          onComplete={handlePhase1LoadingComplete}
        />
      );
    }
    
    if (isComplete) {
      return <ResultsPage formData={formData} onBack={handleBack} />;
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
              Step "{currentStepId}" is not defined in the form configuration.
            </p>
            <button
              onClick={() => {
                setCurrentStepId(getFirstStep().id);
                setHistory([]);
                setFormData({});
                clearFormDataFromStorage();
              }}
              className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Reset Form
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
        currentMedication={currentDynamicMedication}
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
          <div>Step: {currentStepId}</div>
          <div>History: {history.length}</div>
          {isDynamicSubFlowActive && (
            <>
              <div>Dynamic: {currentDynamicMedication}</div>
              <div>SubStep: {dynamicSubStepIndex}</div>
              <div>Queue: {dynamicMedicationQueue.length}</div>
            </>
          )}
          
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
                <div className="mb-2 text-gray-300 font-bold">Regular Steps:</div>
                {formConfig.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => jumpToStep(step.id)}
                    className={`block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded mb-1 ${
                      currentStepId === step.id && !isDynamicSubFlowActive ? 'bg-blue-600' : ''
                    }`}
                  >
                    {step.id} {step.title ? `(${step.title})` : ''}
                  </button>
                ))}
                
                <div className="mt-3 border-t border-gray-600 pt-2">
                  <button
                    onClick={() => {
                      setIsComplete(true);
                      setShowDevNavigation(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded text-green-300"
                  >
                    Complete Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}