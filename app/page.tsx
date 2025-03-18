'use client';

import { useState, useEffect } from 'react';
import MoneyCounter from './components/MoneyCounter';
import ChangeCalculator from './components/ChangeCalculator';
import Preferences from './components/Preferences';
import { Transaction } from './types/types';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState<'counter' | 'calculator'>('counter');
  const [moneyHandedByCustomer, setMoneyHandedByCustomer] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMoneyCountComplete = (total: number) => {
    setMoneyHandedByCustomer(total);
    setCurrentStep('calculator');
  };

  const handleCalculatorComplete = (transaction: {
    amountOnTill: number;
    moneyHandedByCustomer: number;
    changeDue: number;
  }) => {
    // Save to preferences
    const savedPreferences = localStorage.getItem('dyscalc-preferences');
    const preferences = savedPreferences ? JSON.parse(savedPreferences) : { pastInteractions: [] };
    
    const newTransaction: Transaction = {
      ...transaction,
      timestamp: new Date().toISOString(),
    };

    preferences.pastInteractions = [
      ...preferences.pastInteractions,
      newTransaction,
    ].slice(-5);

    localStorage.setItem('dyscalc-preferences', JSON.stringify(preferences));
    
    // Reset to initial state
    setCurrentStep('counter');
    setMoneyHandedByCustomer(0);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="text-[#7CB8B1] text-4xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold font-heiti text-[#7CB8B1]">DYSCAL</h1>
            <p className="text-gray-600">Finding Solutions</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreferences(true)}
          className="px-4 py-2 bg-[#7CB8B1] text-white rounded hover:bg-opacity-90"
        >
          Preferences
        </button>
      </div>

      {showPreferences ? (
        <Preferences onClose={() => setShowPreferences(false)} />
      ) : currentStep === 'counter' ? (
        <MoneyCounter onComplete={handleMoneyCountComplete} />
      ) : (
        <ChangeCalculator
          moneyHandedByCustomer={moneyHandedByCustomer}
          onComplete={handleCalculatorComplete}
        />
      )}
    </main>
  );
}
