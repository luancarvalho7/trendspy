import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function HeightForm({ onContinue, formData }: FormStepProps) {
  const [unit, setUnit] = useState<'feet' | 'inches' | 'centimeters'>(formData?.heightUnit || 'feet');
  const [feet, setFeet] = useState(formData?.heightFeet || '');
  const [inches, setInches] = useState(formData?.heightInches || '');
  const [totalInches, setTotalInches] = useState(formData?.heightTotalInches || '');
  const [centimeters, setCentimeters] = useState(formData?.heightCentimeters || '');

  // Conversion functions
  const convertFeetInchesToCm = (feetVal: string, inchesVal: string): string => {
    const f = parseInt(feetVal) || 0;
    const i = parseInt(inchesVal) || 0;
    if (f === 0 && i === 0) return '';
    return Math.round((f * 12 + i) * 2.54).toString();
  };

  const convertFeetInchesToTotalInches = (feetVal: string, inchesVal: string): string => {
    const f = parseInt(feetVal) || 0;
    const i = parseInt(inchesVal) || 0;
    if (f === 0 && i === 0) return '';
    return (f * 12 + i).toString();
  };

  const convertTotalInchesToCm = (inchesVal: string): string => {
    const inches = parseInt(inchesVal) || 0;
    if (inches === 0) return '';
    return Math.round(inches * 2.54).toString();
  };

  const convertTotalInchesToFeetInches = (inchesVal: string): { feet: string, inches: string } => {
    const totalInches = parseInt(inchesVal) || 0;
    if (totalInches === 0) return { feet: '', inches: '' };
    const f = Math.floor(totalInches / 12);
    const i = totalInches % 12;
    return { feet: f.toString(), inches: i.toString() };
  };

  const convertCmToTotalInches = (cmVal: string): string => {
    const cm = parseInt(cmVal) || 0;
    if (cm === 0) return '';
    return Math.round(cm / 2.54).toString();
  };

  const convertCmToFeetInches = (cmVal: string): { feet: string, inches: string } => {
    const totalInches = convertCmToTotalInches(cmVal);
    return convertTotalInchesToFeetInches(totalInches);
  };

  // Handle unit changes with immediate conversion
  const handleUnitChange = (newUnit: 'feet' | 'inches' | 'centimeters') => {
    // Convert from current unit to new unit
    if (unit === 'feet' && newUnit === 'inches') {
      // Convert feet+inches to total inches
      if (feet || inches) {
        const converted = convertFeetInchesToTotalInches(feet, inches);
        setTotalInches(converted);
      }
      setFeet('');
      setInches('');
      setCentimeters('');
    } else if (unit === 'feet' && newUnit === 'centimeters') {
      // Convert feet+inches to cm
      if (feet || inches) {
        const converted = convertFeetInchesToCm(feet, inches);
        setCentimeters(converted);
      }
      setFeet('');
      setInches('');
      setTotalInches('');
    } else if (unit === 'inches' && newUnit === 'feet') {
      // Convert total inches to feet+inches
      if (totalInches) {
        const converted = convertTotalInchesToFeetInches(totalInches);
        setFeet(converted.feet);
        setInches(converted.inches);
      }
      setTotalInches('');
      setCentimeters('');
    } else if (unit === 'inches' && newUnit === 'centimeters') {
      // Convert total inches to cm
      if (totalInches) {
        const converted = convertTotalInchesToCm(totalInches);
        setCentimeters(converted);
      }
      setTotalInches('');
      setFeet('');
      setInches('');
    } else if (unit === 'centimeters' && newUnit === 'feet') {
      // Convert cm to feet+inches
      if (centimeters) {
        const converted = convertCmToFeetInches(centimeters);
        setFeet(converted.feet);
        setInches(converted.inches);
      }
      setCentimeters('');
      setTotalInches('');
    } else if (unit === 'centimeters' && newUnit === 'inches') {
      // Convert cm to total inches
      if (centimeters) {
        const converted = convertCmToTotalInches(centimeters);
        setTotalInches(converted);
      }
      setCentimeters('');
      setFeet('');
      setInches('');
    }
    
    // Set the new unit
    setUnit(newUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidHeight() && onContinue) {
      if (unit === 'feet') {
        onContinue({ 
          heightUnit: unit, 
          heightFeet: feet, 
          heightInches: inches,
          heightTotalInches: (parseInt(feet) * 12 + parseInt(inches || '0')).toString(),
          heightCentimeters: Math.round((parseInt(feet) * 12 + parseInt(inches || '0')) * 2.54).toString()
        });
      } else {
        onContinue({ 
          heightUnit: unit, 
          heightTotalInches: unit === 'inches' ? totalInches : Math.round(parseInt(centimeters) / 2.54).toString(),
          heightFeet: unit === 'inches' ? Math.floor(parseInt(totalInches) / 12).toString() : Math.floor(parseInt(centimeters) / 2.54 / 12).toString(),
          heightInches: unit === 'inches' ? (parseInt(totalInches) % 12).toString() : Math.round((parseInt(centimeters) / 2.54) % 12).toString(),
          heightCentimeters: unit === 'centimeters' ? centimeters : Math.round(parseInt(totalInches) * 2.54).toString()
        });
      }
    }
  };

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFeet(value);
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInches(value);
    }
  };

  const handleTotalInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTotalInches(value);
    }
  };

  const handleCentimetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCentimeters(value);
    }
  };
  const isValidHeight = () => {
    if (unit === 'feet') {
      const feetNum = parseInt(feet);
      const inchesNum = parseInt(inches || '0');
      return feet && feetNum >= 2 && feetNum <= 8 && inchesNum >= 0 && inchesNum < 12;
    } else if (unit === 'inches') {
      const totalNum = parseInt(totalInches);
      return totalInches && totalNum >= 24 && totalNum <= 108;
    } else {
      const cmNum = parseInt(centimeters);
      return centimeters && cmNum >= 60 && cmNum <= 250;
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
              What is your height?
            </h1>
          </div>

          {/* Unit Toggle */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => handleUnitChange('feet')}
                className={`flex-1 py-3 px-2 rounded-xl text-base font-medium transition-all duration-200 ${
                  unit === 'feet'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Feet
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('inches')}
                className={`flex-1 py-3 px-2 rounded-xl text-base font-medium transition-all duration-200 ${
                  unit === 'inches'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('centimeters')}
                className={`flex-1 py-3 px-2 rounded-xl text-base font-medium transition-all duration-200 ${
                  unit === 'centimeters'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                cm
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex-1">
            {unit === 'feet' ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={feet}
                    onChange={handleFeetChange}
                    className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400 text-center"
                    maxLength={1}
                    inputMode="numeric"
                    placeholder="5"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500 text-center mt-2">Feet</p>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={inches}
                    onChange={handleInchesChange}
                    className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400 text-center"
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="8"
                  />
                  <p className="text-sm text-gray-500 text-center mt-2">Inches</p>
                </div>
              </div>
            ) : unit === 'inches' ? (
              <div>
                <input
                  type="text"
                  value={totalInches}
                  onChange={handleTotalInchesChange}
                  className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400 text-center"
                  maxLength={3}
                  inputMode="numeric"
                  placeholder="68"
                  autoFocus
                />
                <p className="text-sm text-gray-500 text-center mt-2">Total inches</p>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={centimeters}
                  onChange={handleCentimetersChange}
                  className="w-full px-4 py-4 text-lg text-gray-900 bg-white border-2 border-[#CFCFCF] rounded-2xl transition-all duration-200 font-outfit focus:outline-none focus:border-accent hover:border-accent placeholder-gray-400 text-center"
                  maxLength={3}
                  inputMode="numeric"
                  placeholder="170"
                  autoFocus
                />
                <p className="text-sm text-gray-500 text-center mt-2">Centimeters</p>
              </div>
            )}
          </div>

          {/* Bottom Section with Button */}
          <div className="fixed bottom-[50px] left-0 right-0 px-6 max-w-sm mx-auto w-full">
            <button
              type="submit"
              disabled={!isValidHeight()}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidHeight()
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