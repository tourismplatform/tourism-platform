'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'XOF' | 'EUR' | 'USD';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceXof: number) => string;
}

const RATES: Record<CurrencyCode, number> = {
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 610, // Approximate rate
};

const SYMBOLS: Record<CurrencyCode, string> = {
  XOF: 'FCFA',
  EUR: '€',
  USD: '$',
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'XOF',
      setCurrency: (code) => set({ currency: code }),
      formatPrice: (priceXof) => {
        const { currency } = get();
        const converted = priceXof * RATES[currency];
        const symbol = SYMBOLS[currency];

        if (currency === 'XOF') {
          return `${Math.round(converted).toLocaleString()} ${symbol}`;
        }
        
        // standard format for EUR/USD
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
        }).format(converted);
      },
    }),
    { name: 'currency-storage' }
  )
);
