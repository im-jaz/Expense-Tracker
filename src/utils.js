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