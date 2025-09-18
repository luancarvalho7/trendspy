import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function WeightForm({ onContinue, formData }: FormStepProps) {
  const [unit, setUnit] = useState<'lbs' | 'kg'>(formData?.weightUnit || 'lbs');
  const [weightLbs, setWeightLbs] = useState(formData?.weightLbs || '');
  const [weightKg, setWeightKg] = useState(formData?.weightKg || '');

  // Conversion functions
  const convertLbsToKg = (lbs: string): string => {
    const lbsNum = parseFloat(lbs);
    if (!lbs || lbsNum === 0) return '';
    return (lbsNum * 0.453592).toFixed(1);
  };

  const convertKgToLbs = (kg: string): string => {
    const kgNum = parseFloat(kg);
    if (!kg || kgNum === 0) return '';
    return (kgNum * 2.20462).toFixed(1);
  };

  // Handle unit switching with conversion
  const handleUnitChange = (newUnit: 'lbs' | 'kg') => {
    if (unit === newUnit) return;

    if (unit === 'lbs' && newUnit === 'kg') {
      // Convert lbs to kg
      if (weightLbs) {
        const converted = convertLbsToKg(weightLbs);
        setWeightKg(converted);
      }
      setWeightLbs('');
    } else if (unit === 'kg' && newUnit === 'lbs') {
      // Convert kg to lbs
      if (weightKg) {
        const converted = convertKgToLbs(weightKg);
        setWeightLbs(converted);
      }
      setWeightKg('');
    }

    setUnit(newUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (getCurrentWeight().trim() && isValidWeight() && onContinue) {
      if (unit === 'lbs') {
        onContinue({ 
          weightUnit: unit,
          weightLbs: weightLbs,
          weightKg: convertLbsToKg(weightLbs),
          weight: weightLbs // Keep for backward compatibility
        });
      } else {
        onContinue({ 
          weightUnit: unit,
          weightKg: weightKg,
          weightLbs: convertKgToLbs(weightKg),
          weight: convertKgToLbs(weightKg) // Keep for backward compatibility
        });
      }
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers and decimal point, reasonable weight range
    if (/^\d*\.?\d*$/.test(value)) {
      if (unit === 'lbs') {
        setWeightLbs(value);
      } else {
        setWeightKg(value);
      }
    }
  };

  const getCurrentWeight = () => {
    return unit === 'lbs' ? weightLbs : weightKg;
  };

  const isValidWeight = () => {
    const currentWeight = getCurrentWeight();
    const weightNum = parseFloat(currentWeight);
    
    if (!currentWeight || !weightNum) return false;
    
    if (unit === 'lbs') {
      return weightNum >= 50 && weightNum <= 1000;
    } else {
      return weightNum >= 23 && weightNum <= 454; // Equivalent range in kg
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 text-left font-outfit">
              What is your weight?
            </h1>
          </div>

          {/* Unit Toggle */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => handleUnitChange('lbs')}
                className={`flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all duration-200 ${
                  unit === 'lbs'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                lbs
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('kg')}
                className={`flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all duration-200 ${
                  unit === 'kg'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                kg
              </button>
            </div>
          </div>

          {/* Input Field */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={getCurrentWeight()}
                onChange={handleWeightChange}
                className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400 text-center"
                maxLength={6}
                inputMode="decimal"
                autoFocus
                placeholder={unit === 'lbs' ? '150' : '68'}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-lg text-gray-500 font-outfit">{unit}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {unit === 'lbs' ? 'Pounds' : 'Kilograms'}
            </p>
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidWeight()}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidWeight()
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