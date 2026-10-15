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

describe('calculateTotals', () => {
  test('adds income and expenses and works out the balance', () => {
    const totals = calculateTotals(transactions, 'KES', { KES: 1 });
    expect(totals).toEqual({ income: 50000, expenses: 2500, balance: 47500 });
  });

  test('converts totals into the display currency', () => {
    // 50000 KES = 500 USD, 2500 KES = 25 USD
    const totals = calculateTotals(transactions, 'USD', rates);
    expect(totals).toEqual({ income: 500, expenses: 25, balance: 475 });
  });

  test('returns zeros for an empty list', () => {
    expect(calculateTotals([], 'KES', { KES: 1 })).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
    });
  });

  test('skips transactions when the rate is missing', () => {
    expect(calculateTotals(transactions, 'GBP', rates)).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
    });
  });
});

describe('filterTransactions', () => {
  test('filters by category', () => {
    const result = filterTransactions(transactions, { category: 'Food' });
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Groceries');
  });

  test('filters by type', () => {
    expect(filterTransactions(transactions, { type: 'expense' })).toHaveLength(2);
  });

  test('searches the description without caring about case', () => {
    const result = filterTransactions(transactions, { search: 'BUS' });
    expect(result.map((t) => t.id)).toEqual([3]);
  });

  test('returns everything when no filters are set', () => {
    expect(filterTransactions(transactions)).toHaveLength(3);
  });

  test('returns an empty array when nothing matches', () => {
    expect(filterTransactions(transactions, { category: 'Bills' })).toEqual([]);
  });
});

describe('sortByNewest', () => {
  test('puts the newest date first without changing the original', () => {
    const sorted = sortByNewest(transactions);
    expect(sorted.map((t) => t.id)).toEqual([2, 3, 1]);
    expect(transactions.map((t) => t.id)).toEqual([1, 2, 3]);
  });
});

describe('validateTransaction', () => {
  const valid = {
    type: 'expense',
    description: 'Lunch',
    amount: 300,
    category: 'Food',
    date: '2026-10-15',
  };

  test('returns null for a valid transaction', () => {
    expect(validateTransaction(valid)).toBeNull();
  });

  test('rejects an empty description', () => {
    expect(validateTransaction({ ...valid, description: '   ' })).toMatch(/description/i);
  });

  test('rejects zero, negative and missing amounts', () => {
    expect(validateTransaction({ ...valid, amount: 0 })).toMatch(/amount/i);
    expect(validateTransaction({ ...valid, amount: -5 })).toMatch(/amount/i);
    expect(validateTransaction({ ...valid, amount: NaN })).toMatch(/amount/i);
  });

  test('rejects a missing category', () => {
    expect(validateTransaction({ ...valid, category: '' })).toMatch(/category/i);
  });
});

describe('formatMoney', () => {
  test('falls back gracefully for an invalid currency code', () => {
    expect(formatMoney(5, 'NOPE!')).toBe('NOPE! 5.00');
  });
});
