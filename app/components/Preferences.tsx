'use client';

import React, { useState, useEffect } from 'react';
import { Currency, Preferences as PreferencesType } from '../types/types';
import { toast } from 'react-hot-toast';

const CURRENCY_DATA: Currency[] = [
  // Notes
  { value: 20, type: 'note', label: '£20', count: 0, imagePath: '/images/currency/20.png' },
  { value: 10, type: 'note', label: '£10', count: 0, imagePath: '/images/currency/10.png' },
  { value: 5, type: 'note', label: '£5', count: 0, imagePath: '/images/currency/5.png' },
  // Coins
  { value: 2, type: 'coin', label: '£2', count: 0, imagePath: '/images/currency/2.png' },
  { value: 1, type: 'coin', label: '£1', count: 0, imagePath: '/images/currency/1.png' },
  { value: 0.5, type: 'coin', label: '50p', count: 0, imagePath: '/images/currency/50p.png' },
  { value: 0.2, type: 'coin', label: '20p', count: 0, imagePath: '/images/currency/20p.png' },
  { value: 0.1, type: 'coin', label: '10p', count: 0, imagePath: '/images/currency/10p.png' },
  { value: 0.05, type: 'coin', label: '5p', count: 0, imagePath: '/images/currency/5p.png' },
  { value: 0.02, type: 'coin', label: '2p', count: 0, imagePath: '/images/currency/2p.png' },
  { value: 0.01, type: 'coin', label: '1p', count: 0, imagePath: '/images/currency/1p.png' }
];

// Haptic feedback function
const triggerHaptic = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

// Get currency-specific colors
const getCurrencyColor = (currency: Currency) => {
  switch (currency.label) {
    // Notes
    case '£20':
      return 'bg-purple-100 hover:bg-purple-200';  // Purple for £20
    case '£10':
      return 'bg-orange-100 hover:bg-orange-200';  // Brown/orange for £10
    case '£5':
      return 'bg-teal-100 hover:bg-teal-200';      // Turquoise/teal for £5
    // Coins
    case '£2':
      return 'bg-zinc-100 hover:bg-zinc-200';      // Silver/gold for £2
    case '£1':
      return 'bg-yellow-100 hover:bg-yellow-200';  // Gold for £1
    case '50p':
      return 'bg-slate-100 hover:bg-slate-200';    // Silver for 50p
    case '20p':
      return 'bg-slate-100 hover:bg-slate-200';    // Silver for 20p
    case '10p':
      return 'bg-amber-100 hover:bg-amber-200';    // Bronze for 10p
    case '5p':
      return 'bg-slate-100 hover:bg-slate-200';    // Silver for 5p
    case '2p':
      return 'bg-amber-100 hover:bg-amber-200';    // Bronze for 2p
    case '1p':
      return 'bg-amber-100 hover:bg-amber-200';    // Bronze for 1p
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};

interface PreferencesProps {
  onClose: () => void;
}

export default function Preferences({ onClose }: PreferencesProps) {
  const [preferences, setPreferences] = useState<PreferencesType>({
    disabledCurrency: [],
    pastInteractions: [],
  });

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('dyscalc-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('dyscalc-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleToggle = (toggled: Currency) => {
    // Trigger haptic feedback
    triggerHaptic();
    
    const disabledCopy = [...preferences.disabledCurrency];
    const index = disabledCopy.findIndex(c => c.label === toggled.label);

    if (index > -1) {
      // Remove from disabled list
      disabledCopy.splice(index, 1);
    } else {
      // Add to disabled list
      disabledCopy.push(toggled);
    }

    const newPreferences = {
      ...preferences,
      disabledCurrency: disabledCopy
    };

    // Update state and localStorage
    setPreferences(newPreferences);
    localStorage.setItem('dyscalc-preferences', JSON.stringify(newPreferences));

    // Show confirmation toast
    toast.success(`${toggled.label} ${index > -1 ? 'disabled' : 'enabled'}`);
  };

  const handleClearHistory = () => {
    // Trigger haptic feedback for clear cache too
    triggerHaptic();
    setPreferences({
      ...preferences,
      pastInteractions: [],
    });
    localStorage.setItem('dyscalc-preferences', JSON.stringify({
      ...preferences,
      pastInteractions: [],
    }));
  };

  const isCurrencyDisabled = (currency: Currency) => {
    return preferences.disabledCurrency.some(c => c.label === currency.label);
  };

  const notes = CURRENCY_DATA.filter(c => c.type === 'note');
  const coins = CURRENCY_DATA.filter(c => c.type === 'coin');

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center">Currency Preferences</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>

      <h3 className="text-xl font-bold mb-4">Available Currency</h3>
      
      {/* Notes Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Notes</h4>
        <div className="grid grid-cols-3 gap-3">
          {notes.map(currency => (
            <button
              key={currency.label}
              onClick={() => handleToggle(currency)}
              className={`p-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                isCurrencyDisabled(currency)
                  ? 'bg-gray-200'
                  : getCurrencyColor(currency)
              }`}
            >
              <div className={`text-xl font-bold mb-2 ${
                isCurrencyDisabled(currency) ? 'text-red-500' : ''
              }`}>
                {currency.label}
              </div>
              <div className={`text-sm ${
                isCurrencyDisabled(currency) ? 'text-red-500' : 'text-gray-600'
              }`}>
                {isCurrencyDisabled(currency) ? 'Disabled' : 'Available'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coins Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Coins</h4>
        <div className="grid grid-cols-4 gap-3">
          {coins.map(currency => (
            <button
              key={currency.label}
              onClick={() => handleToggle(currency)}
              className={`p-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                isCurrencyDisabled(currency)
                  ? 'bg-gray-200'
                  : getCurrencyColor(currency)
              }`}
            >
              <div className={`text-xl font-bold mb-2 ${
                isCurrencyDisabled(currency) ? 'text-red-500' : ''
              }`}>
                {currency.label}
              </div>
              <div className={`text-sm ${
                isCurrencyDisabled(currency) ? 'text-red-500' : 'text-gray-600'
              }`}>
                {isCurrencyDisabled(currency) ? 'Disabled' : 'Available'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 