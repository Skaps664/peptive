'use client';

import { useState } from 'react';

export default function DosageCalculator() {
  const [selectedSyringe, setSelectedSyringe] = useState(0.3);
  const [peptideQuantity, setPeptideQuantity] = useState<number | null>(null);
  const [waterVolume, setWaterVolume] = useState<number | null>(null);
  const [desiredDose, setDesiredDose] = useState<number | null>(null);
  const [customPeptide, setCustomPeptide] = useState('');
  const [customWater, setCustomWater] = useState('');
  const [customDose, setCustomDose] = useState('');

  // Calculate required dose
  const calculateDose = () => {
    if (!peptideQuantity || !waterVolume || !desiredDose) return null;
    
    // Convert desired dose to mg if in mcg
    const doseInMg = desiredDose < 1 ? desiredDose : desiredDose;
    
    // Calculate concentration (mg/ml)
    const concentration = peptideQuantity / waterVolume;
    
    // Calculate volume needed (ml)
    const volumeNeeded = doseInMg / concentration;
    
    // Calculate units on U-100 syringe
    const units = volumeNeeded * 100;
    
    return {
      volume: volumeNeeded,
      units: Math.round(units)
    };
  };

  const result = calculateDose();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 sm:px-8 lg:px-12 py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-16">
          Dosage Calculator
        </h1>

        {/* Main Calculator Section */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Left Side - Syringe Reference */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Syringe Reference</h2>
            <div className="grid grid-cols-3 gap-6">
              {/* 0.3 ml Syringe */}
              <button
                onClick={() => setSelectedSyringe(0.3)}
                className={`border-2 rounded-2xl p-4 transition-all ${
                  selectedSyringe === 0.3
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-32 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg mb-2 relative">
                    <div className="absolute top-2 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-6 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-10 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-600 rounded-t-lg"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">0.3 ml</span>
                </div>
              </button>

              {/* 0.5 ml Syringe */}
              <button
                onClick={() => setSelectedSyringe(0.5)}
                className={`border-2 rounded-2xl p-4 transition-all ${
                  selectedSyringe === 0.5
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-32 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg mb-2 relative">
                    <div className="absolute top-4 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-8 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-12 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-600 rounded-t-lg"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">0.5 ml</span>
                </div>
              </button>

              {/* 1.0 ml Syringe */}
              <button
                onClick={() => setSelectedSyringe(1.0)}
                className={`border-2 rounded-2xl p-4 transition-all ${
                  selectedSyringe === 1.0
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-32 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg mb-2 relative">
                    <div className="absolute top-6 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-12 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute top-18 left-0 right-0 h-1 bg-white opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-600 rounded-t-lg"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">1.0 ml</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - Input Options */}
          <div className="space-y-8">
            {/* Peptide Vial Quantity */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-14 bg-gradient-to-b from-gray-400 to-gray-500 rounded-sm"></div>
                </div>
                <h3 className="text-base font-bold text-gray-900">Peptide Vial Quantity (mg)</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[2, 3, 5, 10, 15].map((mg) => (
                  <button
                    key={mg}
                    onClick={() => {
                      setPeptideQuantity(mg);
                      setCustomPeptide('');
                    }}
                    className={`relative px-6 py-2.5 border-2 rounded-full text-sm font-medium overflow-hidden group transition-all ${
                      peptideQuantity === mg
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{mg} mg</span>
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Other"
                  value={customPeptide}
                  onChange={(e) => {
                    setCustomPeptide(e.target.value);
                    setPeptideQuantity(parseFloat(e.target.value) || null);
                  }}
                  className="px-6 py-2.5 border-2 border-gray-900 rounded-full text-sm font-medium w-24 text-center"
                />
              </div>
            </div>

            {/* Bacteriostatic Water Volume */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-14 bg-gradient-to-b from-blue-100 to-blue-200 rounded-sm"></div>
                </div>
                <h3 className="text-base font-bold text-gray-900">Bacteriostatic Water Volume (ml)</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 5].map((ml) => (
                  <button
                    key={ml}
                    onClick={() => {
                      setWaterVolume(ml);
                      setCustomWater('');
                    }}
                    className={`relative px-6 py-2.5 border-2 rounded-full text-sm font-medium overflow-hidden group transition-all ${
                      waterVolume === ml
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{ml} ml</span>
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Other"
                  value={customWater}
                  onChange={(e) => {
                    setCustomWater(e.target.value);
                    setWaterVolume(parseFloat(e.target.value) || null);
                  }}
                  className="px-6 py-2.5 border-2 border-gray-900 rounded-full text-sm font-medium w-24 text-center"
                />
              </div>
            </div>

            {/* Desired Dose */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Desired Dose</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '50 mcg', value: 0.05 },
                  { label: '100 mcg', value: 0.1 },
                  { label: '250 mcg', value: 0.25 },
                  { label: '500 mcg', value: 0.5 },
                  { label: '1 mg', value: 1 },
                  { label: '2.5 mg', value: 2.5 },
                ].map((dose) => (
                  <button
                    key={dose.label}
                    onClick={() => {
                      setDesiredDose(dose.value);
                      setCustomDose('');
                    }}
                    className={`relative px-6 py-2.5 border-2 rounded-full text-sm font-medium overflow-hidden group transition-all ${
                      desiredDose === dose.value
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{dose.label}</span>
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Other"
                  value={customDose}
                  onChange={(e) => {
                    setCustomDose(e.target.value);
                    setDesiredDose(parseFloat(e.target.value) || null);
                  }}
                  className="px-6 py-2.5 border-2 border-gray-900 rounded-full text-sm font-medium w-24 text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="border-2 border-gray-900 rounded-3xl p-12">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Your Required Dose
            </h2>
            
            {result ? (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-lg text-gray-900">
                    Draw to the <span className="font-bold text-2xl">{result.volume.toFixed(2)} ml</span> mark on your {selectedSyringe} ml syringe.
                  </p>
                  <p className="text-lg text-gray-900">
                    This is equal to <span className="font-bold text-2xl">{result.units} units</span> on a U-100 syringe.
                  </p>
                </div>

                {/* Syringe Scale Visualization */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                    Syringe Scale Visualization
                  </h3>
                  <div className="relative max-w-xl mx-auto">
                    {/* Syringe */}
                    <div className="h-16 bg-gray-200 rounded-full relative overflow-hidden">
                      {/* Fill */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-red-500 transition-all duration-700 ease-out"
                        style={{ width: `${(result.volume / selectedSyringe) * 100}%` }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-700"></div>
                      </div>
                    </div>
                    {/* Scale Markers */}
                    <div className="flex justify-between mt-2 px-2">
                      <span className="text-sm font-medium text-gray-600">0</span>
                      <span className="text-sm font-medium text-gray-600">0.2</span>
                      <span className="text-sm font-medium text-gray-600">0.4</span>
                      <span className="text-sm font-medium text-gray-600">0.6</span>
                      <span className="text-sm font-medium text-gray-600">0.8</span>
                      <span className="text-sm font-medium text-gray-600">{selectedSyringe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                Please fill in all fields above to calculate your dose.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
