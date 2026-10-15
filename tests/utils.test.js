import { describe, test, expect } from '@jest/globals';
import {
  convertAmount,
  calculateTotals,
  filterTransactions,
  sortByNewest,
  validateTransaction,
  formatMoney,
} from '../src/utils.js';

// Fake rates based on USD (easy numbers): 1 USD = 100 KES = 0.5 EUR
const rates = { USD: 1, KES: 100, EUR: 0.5 };

const transactions = [
  { id: 1, type: 'income', description: 'Salary', amount: 50000, category: 'Salary', date: '2026-10-01' },
  { id: 2, type: 'expense', description: 'Groceries', amount: 2000, category: 'Food', date: '2026-10-05' },
  { id: 3, type: 'expense', description: 'Bus fare', amount: 500, category: 'Transport', date: '2026-10-03' },
];

describe('convertAmount', () => {
  test('returns the same amount when both currencies match', () => {
    expect(convertAmount(25, 'KES', 'KES', rates)).toBe(25);
  });

  test('converts KES to USD using the rates', () => {
    // 1000 KES / 100 * 1 = 10 USD
    expect(convertAmount(1000, 'KES', 'USD', rates)).toBe(10);
  });

  test('converts between two non-base currencies', () => {
    // 1000 KES -> 10 USD -> 5 EUR
    expect(convertAmount(1000, 'KES', 'EUR', rates)).toBe(5);
  });

  test('handles an amount of zero', () => {
    expect(convertAmount(0, 'KES', 'USD', rates)).toBe(0);
  });

  test('returns null when a rate is missing', () => {
    expect(convertAmount(10, 'KES', 'GBP', rates)).toBeNull();
  });

  test('returns null when rates have not loaded yet', () => {
    expect(convertAmount(10, 'KES', 'USD', {})).toBeNull();
  });
});