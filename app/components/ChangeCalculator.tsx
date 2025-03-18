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

export default function ChangeCalculator({ moneyHandedByCustomer, onComplete }: ChangeCalculatorProps) {
  const [amountOnTill, setAmountOnTill] = useState<string>('');
  const [changeDue, setChangeDue] = useState<number>(0);
  const [changeBreakdown, setChangeBreakdown] = useState<Currency[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    disabledCurrency: [],
    pastInteractions: []
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('dyscalc-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const calculateChange = (amount: number) => {
    // Filter out disabled currencies and sort by value
    const availableCurrency = CURRENCY_DATA
      .filter(currency => !preferences.disabledCurrency.some(c => c.label === currency.label))
      .sort((a, b) => b.value - a.value);

    let remaining = Math.abs(amount);
    const breakdown: Currency[] = [];

    for (const currency of availableCurrency) {
      if (remaining >= currency.value) {
        const count = Math.floor(remaining / currency.value);
        remaining = Number((remaining % currency.value).toFixed(2));
        if (count > 0) {
          breakdown.push({ ...currency, count });
        }
      }
    }

    // Show status notifications for all currencies
    CURRENCY_DATA.forEach(currency => {
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

    setChangeBreakdown(breakdown);
    return breakdown;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountOnTill(value);

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const change = moneyHandedByCustomer - numericValue;
      setChangeDue(change);
      calculateChange(Math.abs(change));
    } else {
      setChangeDue(0);
      setChangeBreakdown([]);
    }
  };

  const handleNumpadInput = (value: string) => {
    let newAmount = amountOnTill;
    
    if (value === 'backspace') {
      newAmount = amountOnTill.slice(0, -1);
    } else if (value === 'clear') {
      newAmount = '';
    } else {
      // Ensure we don't add multiple decimal points
      if (value === '.' && amountOnTill.includes('.')) return;
      // Limit to 2 decimal places
      if (amountOnTill.includes('.') && amountOnTill.split('.')[1]?.length >= 2) return;
      newAmount = amountOnTill + value;
    }

    setAmountOnTill(newAmount);

    // Calculate change if we have a valid number
    const numericValue = parseFloat(newAmount);
    if (!isNaN(numericValue)) {
      const change = moneyHandedByCustomer - numericValue;
      setChangeDue(change);
      calculateChange(Math.abs(change));
    } else {
      setChangeDue(0);
      setChangeBreakdown([]);
    }
  };

  const handleComplete = () => {
    if (!amountOnTill || isNaN(parseFloat(amountOnTill))) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Create new transaction with breakdown
    const transaction = {
      amountOnTill: parseFloat(amountOnTill),
      moneyHandedByCustomer,
      changeDue,
      breakdown: changeBreakdown,
      timestamp: new Date().toISOString()
    };

    // Update preferences with new transaction
    const newPreferences = {
      ...preferences,
      pastInteractions: [transaction, ...preferences.pastInteractions].slice(0, 10) // Keep last 10
    };

    // Save to localStorage
    localStorage.setItem('dyscalc-preferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);

    // Call the onComplete callback
    onComplete({
      amountOnTill: parseFloat(amountOnTill),
      moneyHandedByCustomer,
      changeDue
    });
    
    // Reset calculator
    setAmountOnTill('');
    setChangeDue(0);
    setChangeBreakdown([]);
  };

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-center font-heiti">Change Calculator</h2>
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
      
      {showHistory && preferences.pastInteractions.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Recent Calculations</h3>
            <button
              onClick={() => {
                const newPreferences = {
                  ...preferences,
                  pastInteractions: []
                };
                localStorage.setItem('dyscalc-preferences', JSON.stringify(newPreferences));
                setPreferences(newPreferences);
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {preferences.pastInteractions.map((transaction, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Amount: £{transaction.amountOnTill.toFixed(2)}</span>
                  <span>Change: £{transaction.changeDue.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Money handed: £{transaction.moneyHandedByCustomer.toFixed(2)}
                </div>
                {transaction.breakdown && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {transaction.breakdown.map((currency, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs ${getCurrencyColor(currency)}`}
                      >
                        {currency.label} × {currency.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
          <span className="text-2xl font-bold">Amount shown on till:</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amountOnTill}
              onChange={handleAmountChange}
              className="border-2 border-gray-300 rounded-xl p-4 w-48 text-right text-3xl font-bold focus:border-[#7CB8B1] focus:ring-2 focus:ring-[#7CB8B1] focus:outline-none"
              step="0.01"
              min="0"
            />
            <button
              onClick={() => setShowNumpad(!showNumpad)}
              className="p-2 bg-[#7CB8B1] text-white rounded-lg hover:bg-opacity-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {showNumpad && (
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumpadInput(num.toString())}
                  className="p-4 text-2xl font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumpadInput('0')}
                className="p-4 text-2xl font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                0
              </button>
              <button
                onClick={() => handleNumpadInput('.')}
                className="p-4 text-2xl font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                .
              </button>
              <button
                onClick={() => handleNumpadInput('backspace')}
                className="p-4 text-xl font-bold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                ←
              </button>
            </div>
            <button
              onClick={() => handleNumpadInput('clear')}
              className="w-full mt-2 p-4 text-xl font-bold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
          <span className="text-2xl font-bold">Money handed by customer:</span>
          <span className="text-3xl font-bold text-[#4C9B8F]">£{moneyHandedByCustomer.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
          <span className="text-2xl font-bold">Change due:</span>
          <span className={`text-3xl font-bold ${changeDue < 0 ? 'text-red-500' : 'text-[#4C9B8F]'}`}>
            £{changeDue.toFixed(2)}
          </span>
        </div>

        {changeBreakdown.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">Change to give back:</h3>
            
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
                              srcSet={`