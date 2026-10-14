// utils.js
// Pure helper functions: no page (DOM), no fetch, no stored data.
// "Pure" means the same input always gives the same output,
// which makes them easy to unit test.

// Transactions are always stored in this currency (the form says "Amount (KES)")
export const BASE_CURRENCY = 'KES';

// A rate must be a positive number to be usable
function isValidRate(rate) {
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
}

/**
 * Convert an amount from one currency to another.
 *
 * `rates` comes from the API. All rates share one base currency,
 * e.g. base USD: { USD: 1, KES: 129, EUR: 0.92 } means 1 USD = 129 KES.
 * To go from currency A to B we divide by A's rate (back to the base)
 * and multiply by B's rate.
 *
 * Returns null when a rate is missing, so the page can show "—"
 * instead of a wrong number.
 */
export function convertAmount(amount, from, to, rates) {
  if (from === to) {
    return amount;
  }
  const rateFrom = rates ? rates[from] : undefined;
  const rateTo = rates ? rates[to] : undefined;
  if (!isValidRate(rateFrom) || !isValidRate(rateTo)) {
    return null;
  }
  return (amount / rateFrom) * rateTo;
}

/**
 * Add up income and expenses in the display currency.
 * Transactions are stored in KES and converted here.
 * Transactions we cannot convert are skipped.
 * Returns { income, expenses, balance }.
 */
export function calculateTotals(transactions, displayCurrency, rates) {
  const totals = transactions.reduce(
    (sum, transaction) => {
      const converted = convertAmount(
        transaction.amount,
        BASE_CURRENCY,
        displayCurrency,
        rates
      );
      if (converted === null) {
        return sum;
      }
      // Spread operator: copy the old totals, change only one field
      return transaction.type === 'income'
        ? { ...sum, income: sum.income + converted }
        : { ...sum, expenses: sum.expenses + converted };
    },
    { income: 0, expenses: 0 }
  );

  return { ...totals, balance: totals.income - totals.expenses };
}

/**
 * Filter transactions by search text, category and type.
 * "all" means "do not filter on this field".
 */
export function filterTransactions(transactions, filters = {}) {
  const { search = '', category = 'all', type = 'all' } = filters;
  const text = search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesText = transaction.description.toLowerCase().includes(text);
    const matchesCategory = category === 'all' || transaction.category === category;
    const matchesType = type === 'all' || transaction.type === type;
    return matchesText && matchesCategory && matchesType;
  });
}

/**
 * Return a copy of the list with the newest dates first.
 * The spread copy means the original array is not changed.
 */
export function sortByNewest(transactions) {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Check a transaction from the form.
 * Returns an error message, or null when everything is fine.
 */
export function validateTransaction({ type, description, amount, category, date }) {
  if (type !== 'income' && type !== 'expense') {
    return 'Please choose a transaction type.';
  }
  if (!description || description.trim() === '') {
    return 'Please enter a description.';
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Please enter an amount greater than 0.';
  }
  if (!category) {
    return 'Please select a category.';
  }
  if (!date) {
    return 'Please choose a date.';
  }
  return null;
}

/**
 * Format a number as money, e.g. formatMoney(1234.5, 'USD') -> "US$1,234.50".
 */
export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    // Unknown currency code: fall back to a plain format
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Turn "2026-10-15" into a friendly date like "15 Oct 2026".
 */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}