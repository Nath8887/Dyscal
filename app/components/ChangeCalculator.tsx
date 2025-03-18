'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Currency } from '../types/types';
import { toast } from 'react-hot-toast';

interface ChangeCalculatorProps {
  moneyHandedByCustomer: number;
  onComplete: (transaction: { amountOnTill: number; moneyHandedByCustomer: number; changeDue: number }) => void;
}

const CURRENCY_DATA: Currency[] = [
  { value: 50, type: 'note', label: '£50', count: 0, imagePath: 'https://i.imgur.com/YqhWHYL.jpg' },
  { value: 20, type: 'note', label: '£20', count: 0, imagePath: 'https://i.imgur.com/QWVXkb5.jpg' },
  { value: 10, type: 'note', label: '£10', count: 0, imagePath: 'https://i.imgur.com/8JHxcqL.jpg' },
  { value: 5, type: 'note', label: '£5', count: 0, imagePath: 'https://i.imgur.com/2DTWxkN.jpg' },
  { value: 2, type: 'coin', label: '£2', count: 0, imagePath: 'https://i.imgur.com/L5Wpxk7.png' },
  { value: 1, type: 'coin', label: '£1', count: 0, imagePath: 'https://i.imgur.com/Y5Kxrj3.png' },
  { value: 0.5, type: 'coin', label: '50p', count: 0, imagePath: 'https://i.imgur.com/JnVc6CQ.png' },
  { value: 0.2, type: 'coin', label: '20p', count: 0, imagePath: 'https://i.imgur.com/xK7Ql2P.png' },
  { value: 0.1, type: 'coin', label: '10p', count: 0, imagePath: 'https://i.imgur.com/2X7MYf9.png' },
  { value: 0.05, type: 'coin', label: '5p', count: 0, imagePath: 'https://i.imgur.com/QWqQWZ3.png' },
  { value: 0.02, type: 'coin', label: '2p', count: 0, imagePath: 'https://i.imgur.com/8YfXLRL.png' },
  { value: 0.01, type: 'coin', label: '1p', count: 0, imagePath: 'https://i.imgur.com/ZZkYxkE.png' },
];

export default function ChangeCalculator({ moneyHandedByCustomer, onComplete }: ChangeCalculatorProps) {
  const [amountOnTill, setAmountOnTill] = useState<string>('');
  const [changeDue, setChangeDue] = useState<number>(0);
  const [changeBreakdown, setChangeBreakdown] = useState<Currency[]>([]);

  const calculateChange = (amount: number) => {
    let remaining = amount;
    const breakdown: Currency[] = [];
    
    // Sort currency by value (highest to lowest)
    const sortedCurrency = [...CURRENCY_DATA].sort((a, b) => b.value - a.value);
    
    for (const currency of sortedCurrency) {
      if (remaining >= currency.value) {
        const count = Math.floor(remaining / currency.value);
        remaining = Number((remaining % currency.value).toFixed(2));
        if (count > 0) {
          breakdown.push({ ...currency, count });
        }
      }
    }
    
    return breakdown;
  };

  const handleAmountInput = (value: string) => {
    if (value === '') {
      setAmountOnTill('');
      setChangeDue(0);
      setChangeBreakdown([]);
      return;
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setAmountOnTill(value);
      const change = moneyHandedByCustomer - numericValue;
      setChangeDue(change);
      if (change > 0) {
        setChangeBreakdown(calculateChange(change));
      } else {
        setChangeBreakdown([]);
      }
    }
  };

  const handleComplete = () => {
    if (!amountOnTill || isNaN(parseFloat(amountOnTill))) {
      toast.error('Please enter a valid amount');
      return;
    }

    onComplete({
      amountOnTill: parseFloat(amountOnTill),
      moneyHandedByCustomer,
      changeDue,
    });
  };

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center font-heiti">Change Calculator</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-3 rounded">
          <span className="font-bold">Amount shown on till:</span>
          <input
            type="number"
            value={amountOnTill}
            onChange={(e) => handleAmountInput(e.target.value)}
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
                        className="p-2 rounded-lg bg-green-100 flex flex-col items-center"
                      >
                        <div className="relative w-full aspect-[2/1] mb-2">
                          <Image
                            src={currency.imagePath}
                            alt={currency.label}
                            fill
                            className="object-contain rounded"
                            sizes="(max-width: 640px) 150px, 200px"
                            priority
                          />
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
                        className="p-2 rounded-lg bg-gray-100 flex flex-col items-center"
                      >
                        <div className="relative w-full aspect-square mb-2">
                          <Image
                            src={currency.imagePath}
                            alt={currency.label}
                            fill
                            className="object-contain rounded-full"
                            sizes="(max-width: 640px) 80px, 100px"
                            priority
                          />
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
          className="w-full mt-6 px-6 py-3 bg-[#7CB8B1] text-white rounded hover:bg-opacity-90 font-bold"
        >
          Done
        </button>
      </div>
    </div>
  );
} 