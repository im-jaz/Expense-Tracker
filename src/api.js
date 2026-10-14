// api.js
// Everything that talks to the exchange rate REST API lives here.

const API_URL = 'https://open.er-api.com/v6/latest';

/**
 * Fetch the latest exchange rates for a base currency.
 * Example: fetchRates('USD') -> { USD: 1, EUR: 0.92, KES: 129, ... }
 */
export async function fetchRates(baseCurrency) {
  let response;

  // Network problems (offline, blocked...) make fetch() throw
  try {
    response = await fetch(`${API_URL}/${baseCurrency}`);
  } catch {
    throw new Error('Could not reach the exchange rate service. Check your internet connection.');
  }

  const data = await response.json();
  return data.rates;
}