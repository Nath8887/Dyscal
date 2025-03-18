'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Currency, Preferences } from '../types/types';
import { toast } from 'react-hot-toast';

interface ChangeCalculatorProps {
  moneyHandedByCustomer: number;
  onComplete: (transaction: { amountOnTill: number; moneyHandedByCustomer: number; changeDue: number }) => void;
}

interface HistoryEntry {
  amountOnTill: string;
  changeDue: number;
  breakdown: Currency[];
  timestamp: string;
}

const CURRENCY_DATA: Currency[] = [
  { value: 20, type: 'note', label: '£20', count: 0, imagePath: '/images/currency/20.png' },
  { value: 10, type: 'note', label: '£10', count: 0, imagePath: '/images/currency/10.png' },
  { value: 5, type: 'note', label: '£5', count: 0, imagePath: '/images/currency/5.png' },
  { value: 2, type: 'coin', label: '£2', count: 0, imagePath: '/images/currency/2.png' },
  { value: 1, type: 'coin', label: '£1', count: 0, imagePath: '/images/currency/1.png' },
  { value: 0.5, type: 'coin', label: '50p', count: 0, imagePath: '/images/currency/50p.png' },
  { value: 0.2, type: 'coin', label: '20p', count: 0, imagePath: '/images/currency/20p.png' },
  { value: 0.1, type: 'coin', label: '10p', count: 0, imagePath: '/images/currency/10p.png' },
  { value: 0.05, type: 'coin', label: '5p', count: 0, imagePath: '/images/currency/5p.png' },
  { value: 0.02, type: 'coin', label: '2p', count: 0, imagePath: '/images/currency/2p.png' },
  { value: 0.01, type: 'coin', label: '1p', count: 0, imagePath: '/images/currency/1p.png' }
];

// Get currency-specific colors
const getCurrencyColor = (currency: Currency) => {
  switch (currency.label) {
    // Notes
    case '£20':
      return 'bg-purple-100';  // Purple for £20
    case '£10':
      return 'bg-orange-100';  // Brown/orange for £10
    case '£5':
      return 'bg-teal-100';    // Turquoise/teal for £5
    // Coins
    case '£2':
      return 'bg-zinc-100';    // Silver/gold for £2
    case '£1':
      return 'bg-yellow-100';  // Gold for £1
    case '50p':
      return 'bg-slate-100';   // Silver for 50p
    case '20p':
      return 'bg-slate-100';   // Silver for 20p
    case '10p':
      return 'bg-amber-100';   // Bronze for 10p
    case '5p':
      return 'bg-slate-100';   // Silver for 5p
    case '2p':
      return 'bg-amber-100';   // Bronze for 2p
    case '1p':
      return 'bg-amber-100';   // Bronze for 1p
    default:
      return 'bg-gray-100';
  }
};

export default function ChangeCalculator({ moneyHandedByCustomer, onComplete }: ChangeCalculatorProps) {
  const [amountOnTill, setAmountOnTill] = useState<string>('');
  const [changeDue, setChangeDue] = useState<number>(0);
  const [changeBreakdown, setChangeBreakdown] = useState<Currency[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    disabledCurrency: [],
    pastInteractions: []
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('dyscalc-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const calculateChange = (amount: number) => {
    const availableCurrency = CURRENCY_DATA.filter(
      (currency) => !preferences.disabledCurrency.some((c) => c.label === currency.label)
    ).sort((a, b) => b.value - a.value);

    let remainingChange = amount;
    const breakdown: Currency[] = [];

    availableCurrency.forEach((currency) => {
      const count = Math.floor(remainingChange / currency.value);
      if (count > 0) {
        breakdown.push({ ...currency, count });
        remainingChange = parseFloat((remainingChange % currency.value).toFixed(2));
      }
    });

    setChangeBreakdown(breakdown);
    return breakdown;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountOnTill(value);

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const change = calculateChange(numericValue);
      setChangeDue(numericValue);
      
      // Show toast with currency status
      change.forEach(currency => {
        const isDisabled = preferences.disabledCurrency.some(c => c.label === currency.label);
        toast(
          `${currency.label} ${isDisabled ? 'not available' : 'available'}`,
          {
            icon: isDisabled ? '❌' : '✅',
            style: {
              background: isDisabled ? '#FEE2E2' : '#ECFDF5',
              color: isDisabled ? '#DC2626' : '#059669',
              fontWeight: 'bold'
            }
          }
        );
      });
    }
  };

  const handleComplete = () => {
    if (!amountOnTill || isNaN(parseFloat(amountOnTill))) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Add current calculation to history
    const newEntry: HistoryEntry = {
      amountOnTill: amountOnTill,
      changeDue: changeDue,
      breakdown: changeBreakdown,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10 entries

    // Call the onComplete callback
    onComplete({
      amountOnTill: parseFloat(amountOnTill),
      moneyHandedByCustomer,
      changeDue,
    });
    
    // Reset calculator
    setAmountOnTill('');
    setChangeDue(0);
    setChangeBreakdown([]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center font-heiti">Change Calculator</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-[#7CB8B1] text-white rounded-full hover:bg-opacity-90 font-bold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          <button
            onClick={() => {
              setAmountOnTill('');
              setChangeDue(0);
              setChangeBreakdown([]);
            }}
            className="px-4 py-2 bg-[#7CB8B1] text-white rounded-full hover:bg-opacity-90 font-bold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {showHistory && history.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Recent Calculations</h3>
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {history.map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Amount: £{entry.amountOnTill}</span>
                  <span>Change: £{entry.changeDue.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {entry.timestamp}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {entry.breakdown.map((currency, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs ${getCurrencyColor(currency)}`}
                    >
                      {currency.label} × {currency.count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-3 rounded">
          <span className="font-bold">Amount shown on till:</span>
          <input
            type="number"
            value={amountOnTill}
            onChange={handleAmountChange}
            className="border rounded p-2 w-32 text-right"
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex justify-between items-center bg-white p-3 rounded">
          <span className="font-bold">Money handed by customer:</span>
          <span className="font-bold">£{moneyHandedByCustomer.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center bg-white p-3 rounded">
          <span className="font-bold">Change due:</span>
          <span className={`font-bold ${changeDue < 0 ? 'text-red-500' : 'text-green-500'}`}>
            £{changeDue.toFixed(2)}
          </span>
        </div>

        {changeBreakdown.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Change to give back:</h3>
            
            {/* Notes Section */}
            {changeBreakdown.some(c => c.type === 'note') && (
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-2">Notes:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {changeBreakdown
                    .filter(c => c.type === 'note')
                    .map((currency, index) => (
                      <motion.div
                        key={currency.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2 rounded-lg ${getCurrencyColor(currency)} flex flex-col items-center`}
                      >
                        <div className="relative w-full aspect-[2/1] mb-2">
                          <picture>
                            <source
                              srcSet={`${currency.imagePath.replace('.png', '')}-sm.webp 100w, ${currency.imagePath.replace('.png', '')}-md.webp 150w, ${currency.imagePath.replace('.png', '')}.webp 200w`}
                              sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                              type="image/webp"
                            />
                            <source
                              srcSet={`${currency.imagePath.replace('.png', '')}-sm.png 100w, ${currency.imagePath.replace('.png', '')}-md.png 150w, ${currency.imagePath.replace('.png', '')}.png 200w`}
                              sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                              type="image/png"
                            />
                            <Image
                              src={currency.imagePath}
                              alt={currency.label}
                              fill
                              className="object-contain rounded"
                              sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                              priority
                            />
                          </picture>
                        </div>
                        <div className="text-lg font-bold">{currency.label}</div>
                        <div className="text-sm font-semibold">Quantity: {currency.count}</div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Coins Section */}
            {changeBreakdown.some(c => c.type === 'coin') && (
              <div>
                <h4 className="text-md font-semibold mb-2">Coins:</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {changeBreakdown
                    .filter(c => c.type === 'coin')
                    .map((currency, index) => (
                      <motion.div
                        key={currency.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2 rounded-lg ${getCurrencyColor(currency)} flex flex-col items-center`}
                      >
                        <div className="relative w-full aspect-square mb-2">
                          <picture>
                            <source
                              srcSet={`${currency.imagePath.replace('.png', '')}-sm.webp 100w, ${currency.imagePath.replace('.png', '')}-md.webp 150w, ${currency.imagePath.replace('.png', '')}.webp 200w`}
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                              type="image/webp"
                            />
                            <source
                              srcSet={`${currency.imagePath.replace('.png', '')}-sm.png 100w, ${currency.imagePath.replace('.png', '')}-md.png 150w, ${currency.imagePath.replace('.png', '')}.png 200w`}
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                              type="image/png"
                            />
                            <Image
                              src={currency.imagePath}
                              alt={currency.label}
                              fill
                              className="object-contain rounded-full"
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                              priority
                            />
                          </picture>
                        </div>
                        <div className="text-lg font-bold">{currency.label}</div>
                        <div className="text-sm font-semibold">Quantity: {currency.count}</div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleComplete}
          className="w-full mt-6 px-6 py-4 bg-[#4C9B8F] text-white rounded-lg hover:bg-opacity-90 font-bold text-lg shadow-md transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
} 