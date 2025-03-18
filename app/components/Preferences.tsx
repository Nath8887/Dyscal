'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Currency, Preferences as PreferencesType } from '../types/types';

const CURRENCY_DATA: Currency[] = [
  { value: 10, type: "note", label: "£10", count: 0, imagePath: "/images/currency/10.png" },
  { value: 5, type: "note", label: "£5", count: 0, imagePath: "/images/currency/5.png" },
  { value: 2, type: "coin", label: "£2", count: 0, imagePath: "/images/currency/2.png" },
  { value: 1, type: "coin", label: "£1", count: 0, imagePath: "/images/currency/1.png" },
  { value: 0.5, type: "coin", label: "50p", count: 0, imagePath: "/images/currency/50p.png" },
  { value: 0.2, type: "coin", label: "20p", count: 0, imagePath: "/images/currency/20p.png" },
  { value: 0.1, type: "coin", label: "10p", count: 0, imagePath: "/images/currency/10p.png" },
  { value: 0.05, type: "coin", label: "5p", count: 0, imagePath: "/images/currency/5p.png" },
  { value: 0.02, type: "coin", label: "2p", count: 0, imagePath: "/images/currency/2p.png" },
  { value: 0.01, type: "coin", label: "1p", count: 0, imagePath: "/images/currency/1p.png" }
];

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

  const toggleCurrency = (currency: Currency) => {
    const isDisabled = preferences.disabledCurrency.some((c) => c.label === currency.label);
    
    if (isDisabled) {
      setPreferences({
        ...preferences,
        disabledCurrency: preferences.disabledCurrency.filter((c) => c.label !== currency.label),
      });
    } else {
      setPreferences({
        ...preferences,
        disabledCurrency: [...preferences.disabledCurrency, currency],
      });
    }
  };

  const clearCache = () => {
    setPreferences({
      ...preferences,
      pastInteractions: [],
    });
  };

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heiti">Preferences</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-3">Available Currency</h3>
          <div className="grid grid-cols-4 gap-4">
            {CURRENCY_DATA.map((currency) => {
              const isDisabled = preferences.disabledCurrency.some(
                (c) => c.label === currency.label
              );
              return (
                <button
                  key={currency.label}
                  onClick={() => toggleCurrency(currency)}
                  className={`p-3 rounded-lg transition-colors ${
                    isDisabled
                      ? 'bg-gray-300'
                      : currency.type === 'note'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-lg font-bold">{currency.label}</div>
                  <div className="text-sm">{isDisabled ? 'Disabled' : 'Available'}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Past Interactions</h3>
            <button
              onClick={clearCache}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Clear Cache
            </button>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount on Till</th>
                  <th className="px-4 py-2 text-right">Money Handed</th>
                  <th className="px-4 py-2 text-right">Change Due</th>
                </tr>
              </thead>
              <tbody>
                {preferences.pastInteractions.slice(-5).map((transaction, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      £{transaction.amountOnTill.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      £{transaction.moneyHandedByCustomer.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      £{transaction.changeDue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 