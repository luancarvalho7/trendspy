import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function ProfileMonitoringForm({ onContinue, formData }: FormStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(formData?.profileMonitoring || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (answer === 'Não') {
      // Send POST request to webhook
      handleNoSelection(answer);
    } else {
      // Auto-forward for "Sim" - go directly to targets without suggestions
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
        
        // Extract profiles from webhook response and format for targets step
        let suggestedProfiles = [];
        if (Array.isArray(responseData)) {
          suggestedProfiles = responseData.map((profileObj: any) => ({
            text: profileObj.username, // username already without @
            niche: profileObj.niche, // Store niche for display
            type: 'aiRecommend'
          }));
        }

        // Continue to targets step with the AI suggestions
        if (onContinue) {
          onContinue({ 
            profileMonitoring: answer,
            aiSuggestedProfiles: suggestedProfiles
          });
        }
      } else {
        console.error('Webhook request failed:', response.status, response.statusText);
        // Continue to targets step without suggestions on error
        if (onContinue) {
          onContinue({ 
            profileMonitoring: answer,
            aiSuggestedProfiles: []
          });
        }
      }
    } catch (error) {
      console.error('Webhook request error:', error);
      // Continue to targets step without suggestions on error
      if (onContinue) {
        onContinue({ 
          profileMonitoring: answer,
          aiSuggestedProfiles: []
        });
      }
    } finally {
      setIsLoading(false);
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