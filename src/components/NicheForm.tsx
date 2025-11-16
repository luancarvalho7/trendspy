import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps, Niche } from '../types/form';

export default function NicheForm({ onContinue, formData }: FormStepProps) {
  // State for fetching niches from webhook
  const [availableNiches, setAvailableNiches] = useState<string[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customNiche, setCustomNiche] = useState('');
  
  // Check if we have niches from website analysis, otherwise use existing niches
  const getInitialNiches = () => {
    if (formData?.niches && formData.niches.length > 0) {
      // Handle both old format (strings) and new format (objects)
      return formData.niches.map(niche => {
        if (typeof niche === 'string') {
          return { text: niche, type: 'manualAdded' as const };
        }
        return niche;
      });
    }
    return [];
  };
  
  const [niches, setNiches] = useState<Niche[]>(getInitialNiches());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  // Fetch niches from webhook on component mount
  useEffect(() => {
    const fetchNiches = async () => {
      try {
        setIsLoadingNiches(true);
        const response = await fetch('https://webhook.workez.online/webhook/getNiches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Niches response:', responseData);
          
          // Extract niches from response
          if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].niches) {
            setAvailableNiches(responseData[0].niches);
          } else {
            // Fallback niches if webhook fails
            setAvailableNiches([
              'Tecnologia', 'Marketing Digital', 'Finanças', 'Saúde e Bem-estar', 
              'Educação', 'Lifestyle', 'Negócios', 'Design', 'Fotografia'
            ]);
          }
        } else {
          console.error('Failed to fetch niches:', response.status);
          // Fallback niches
          setAvailableNiches([
            'Tecnologia', 'Marketing Digital', 'Finanças', 'Saúde e Bem-estar', 
            'Educação', 'Lifestyle', 'Negócios', 'Design', 'Fotografia'
          ]);
        }
      } catch (error) {
        console.error('Error fetching niches:', error);
        // Fallback niches
        setAvailableNiches([
          'Tecnologia', 'Marketing Digital', 'Finanças', 'Saúde e Bem-estar', 
          'Educação', 'Lifestyle', 'Negócios', 'Design', 'Fotografia'
        ]);
      } finally {
        setIsLoadingNiches(false);
      }
    };

    fetchNiches();
  }, []);

  // React to formData changes (e.g., when coming from website analysis)
  useEffect(() => {
    const newNiches = getInitialNiches();
    if (newNiches.length > 0 && JSON.stringify(newNiches.map(n => n.text)) !== JSON.stringify(niches.map(n => n.text))) {
      setNiches(newNiches);
    }
  }, [formData]);

  const handleSelectNiche = (selectedNiche: string) => {
    if (selectedNiche === 'Outro') {
      setShowOtherInput(true);
      return;
    }
    
    // Check if already selected
    if (!niches.some(n => n.text === selectedNiche) && niches.length < 6) {
      setNiches([...niches, { text: selectedNiche, type: 'manualAdded' }]);
    }
  };

  const handleAddCustomNiche = () => {
    const trimmedNiche = customNiche.trim();
    if (trimmedNiche && !niches.some(n => n.text === trimmedNiche) && niches.length < 6) {
      setNiches([...niches, { text: trimmedNiche, type: 'manualAdded' }]);
      setCustomNiche('');
      setShowOtherInput(false);
    }
  };

  const handleRemoveNiche = (index: number) => {
    setNiches(niches.filter((_, i) => i !== index));
    // Cancel editing if we're removing the niche being edited
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleEditNiche = (index: number) => {
    // Don't allow editing of AI-recommended niches
    if (niches[index].type === 'aiRecommend') {
      return;
    }
    setEditingIndex(index);
    setEditingValue(niches[index].text);
  };

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editingValue.trim();
    if (trimmedValue && !niches.some((niche, i) => i !== index && niche.text === trimmedValue)) {
      const updatedNiches = [...niches];
      updatedNiches[index] = { ...updatedNiches[index], text: trimmedValue };
      setNiches(updatedNiches);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCustomNicheKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomNiche();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowOtherInput(false);
      setCustomNiche('');
    }
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
    if (value.length <= 50) {
      setEditingValue(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (niches.length > 0 && onContinue) {
      onContinue({ niches });
    }
  };

  const isValidToSubmit = niches.length > 0;

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
              Qual ou quais são os seus nicho(s)?
            </h1>
            {formData?.niches && formData.niches.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Nichos sugeridos baseados no seu website
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Digite um nicho e pressione Enter para adicionar (máximo 6)
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            {isLoadingNiches ? (
              <div className="w-full py-8 text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                  <span className="text-base text-gray-600 font-outfit">
                    Carregando nichos...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <select
                  onChange={(e) => handleSelectNiche(e.target.value)}
                  disabled={niches.length >= 6}
                  className="w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent"
                  value=""
                >
                  <option value="" disabled>
                    {niches.length >= 6 ? 'Limite máximo atingido' : 'Selecione um nicho'}
                  </option>
                  {availableNiches.map((niche, index) => (
                    <option
                      key={index}
                      value={niche}
                      disabled={niches.some(n => n.text === niche)}
                    >
                      {niche} {niches.some(n => n.text === niche) ? '(já selecionado)' : ''}
                    </option>
                  ))}
                  <option value="Outro">Outro</option>
                </select>

                {/* Custom niche input */}
                {showOtherInput && (
                  <div className="mt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customNiche}
                        onChange={(e) => setCustomNiche(e.target.value)}
                        onKeyPress={handleCustomNicheKeyPress}
                        className="flex-1 px-4 py-3 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400"
                        placeholder="Digite seu nicho personalizado"
                        maxLength={50}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomNiche}
                        disabled={!customNiche.trim() || niches.some(n => n.text === customNiche.trim())}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                          customNiche.trim() && !niches.some(n => n.text === customNiche.trim())
                            ? 'bg-accent text-white hover:bg-accent/90'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtherInput(false);
                        setCustomNiche('');
                      }}
                      className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selected Niches */}
          <div className="flex-1">
            {niches.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Nichos adicionados ({niches.length}/6):
                </div>
                <div className="space-y-2">
                  {niches.map((niche, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-xl"
                    >
                      {editingIndex === index ? (
                        // Edit mode
                        <>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={handleEditChange}
                            onKeyDown={(e) => handleEditKeyPress(e, index)}
                            className="flex-1 px-2 py-1 text-accent font-medium bg-white border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 mr-2"
                            maxLength={50}
                            autoFocus
                          />
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
                          <span className="text-accent font-medium flex-1">{niche.text}</span>
                          <div className="flex items-center space-x-1">
                            {niche.type === 'aiRecommend' ? (
                              <>
                                <div className="text-purple-500 p-1" title="AI Suggested">
                                  ⭐
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNiche(index)}
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
                                  onClick={() => handleRemoveNiche(index)}
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
          <div className="pt-6 pb-8">
            <button
              type="submit"
              disabled={!isValidToSubmit}
              className={`w-full py-3 px-6 rounded-full font-medium text-white text-base transition-all duration-200 font-outfit ${
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