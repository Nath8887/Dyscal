'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Currency, MoneyCounterState } from '../types/types';

const CURRENCY_DATA: Currency[] = [
  { value: 50, type: 'note', label: '£50', count: 0, imagePath: '/images/currency/50' },
  { value: 20, type: 'note', label: '£20', count: 0, imagePath: '/images/currency/20' },
  { value: 10, type: 'note', label: '£10', count: 0, imagePath: '/images/currency/10' },
  { value: 5, type: 'note', label: '£5', count: 0, imagePath: '/images/currency/5' },
  { value: 2, type: 'coin', label: '£2', count: 0, imagePath: '/images/currency/2' },
  { value: 1, type: 'coin', label: '£1', count: 0, imagePath: '/images/currency/1' },
  { value: 0.5, type: 'coin', label: '50p', count: 0, imagePath: '/images/currency/50p' },
  { value: 0.2, type: 'coin', label: '20p', count: 0, imagePath: '/images/currency/20p' },
  { value: 0.1, type: 'coin', label: '10p', count: 0, imagePath: '/images/currency/10p' },
  { value: 0.05, type: 'coin', label: '5p', count: 0, imagePath: '/images/currency/5p' },
  { value: 0.02, type: 'coin', label: '2p', count: 0, imagePath: '/images/currency/2p' },
  { value: 0.01, type: 'coin', label: '1p', count: 0, imagePath: '/images/currency/1p' }
];

export default function MoneyCounter({ onComplete }: { onComplete: (total: number) => void }) {
  const [state, setState] = useState<MoneyCounterState>({
    total: 0,
    selectedCurrency: CURRENCY_DATA,
    history: [],
  });

  const [longPressActive, setLongPressActive] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const handleCurrencyClick = (currency: Currency) => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }

    const updatedCurrency = state.selectedCurrency.map((c) =>
      c.label === currency.label ? { ...c, count: c.count + 1 } : c
    );

    setState({
      ...state,
      total: state.total + currency.value,
      selectedCurrency: updatedCurrency,
      history: [...state.history, { action: 'add', currency }],
    });
  };

  const handleLongPress = (currency: Currency) => {
    setLongPressActive(true);
    setSelectedCurrency(currency);
  };

  const handleMultipleInput = (currency: Currency, count: number) => {
    const updatedCurrency = state.selectedCurrency.map((c) =>
      c.label === currency.label ? { ...c, count: c.count + count } : c
    );

    setState({
      ...state,
      total: state.total + (currency.value * count),
      selectedCurrency: updatedCurrency,
      history: [...state.history, { action: `add_multiple_${count}`, currency }],
    });

    setLongPressActive(false);
    setSelectedCurrency(null);
  };

  const handleUndo = () => {
    if (state.history.length === 0) return;

    const lastAction = state.history[state.history.length - 1];
    const updatedCurrency = state.selectedCurrency.map((c) =>
      c.label === lastAction.currency.label ? { ...c, count: c.count - 1 } : c
    );

    setState({
      ...state,
      total: state.total - lastAction.currency.value,
      selectedCurrency: updatedCurrency,
      history: state.history.slice(0, -1),
    });
  };

  return (
    <div className="p-4 bg-[#F9F9F2] rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center font-heiti">Money Counter</h2>
      
      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {state.selectedCurrency
            .filter((c) => c.type === 'note')
            .map((currency) => (
              <motion.button
                key={currency.label}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors flex flex-col items-center"
                onClick={() => handleCurrencyClick(currency)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(currency);
                }}
              >
                <div className="relative w-full aspect-[2/1] mb-2">
                  <picture>
                    <source
                      srcSet={`${currency.imagePath}-sm.webp 100w, ${currency.imagePath}-md.webp 150w, ${currency.imagePath}.webp 200w`}
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                      type="image/webp"
                    />
                    <source
                      srcSet={`${currency.imagePath}-sm.png 100w, ${currency.imagePath}-md.png 150w, ${currency.imagePath}.png 200w`}
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                      type="image/png"
                    />
                    <Image
                      src={`${currency.imagePath}.png`}
                      alt={currency.label}
                      fill
                      className="object-contain rounded"
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
                      priority
                    />
                  </picture>
                </div>
                <span className="block text-lg font-bold">{currency.label}</span>
                {currency.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {currency.count}
                  </span>
                )}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Coins Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Coins</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {state.selectedCurrency
            .filter((c) => c.type === 'coin')
            .map((currency) => (
              <motion.button
                key={currency.label}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex flex-col items-center"
                onClick={() => handleCurrencyClick(currency)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(currency);
                }}
              >
                <div className="relative w-full aspect-square mb-2">
                  <picture>
                    <source
                      srcSet={`${currency.imagePath}-sm.webp 100w, ${currency.imagePath}-md.webp 150w, ${currency.imagePath}.webp 200w`}
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                      type="image/webp"
                    />
                    <source
                      srcSet={`${currency.imagePath}-sm.png 100w, ${currency.imagePath}-md.png 150w, ${currency.imagePath}.png 200w`}
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                      type="image/png"
                    />
                    <Image
                      src={`${currency.imagePath}.png`}
                      alt={currency.label}
                      fill
                      className="object-contain rounded-full"
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                      priority
                    />
                  </picture>
                </div>
                <span className="block text-lg font-bold">{currency.label}</span>
                {currency.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {currency.count}
                  </span>
                )}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Multiple Input Modal */}
      {longPressActive && selectedCurrency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">Enter quantity for {selectedCurrency.label}</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-lg font-bold"
                  onClick={() => handleMultipleInput(selectedCurrency, num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setLongPressActive(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Total and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <button
          onClick={handleUndo}
          disabled={state.history.length === 0}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 rounded disabled:opacity-50 font-bold"
        >
          Undo
        </button>
        <div className="text-3xl font-bold">£{state.total.toFixed(2)}</div>
        <button
          onClick={() => onComplete(state.total)}
          className="w-full sm:w-auto px-6 py-3 bg-[#7CB8B1] text-white rounded hover:bg-opacity-90 font-bold"
        >
          Continue to Change
        </button>
      </div>
    </div>
  );
} 