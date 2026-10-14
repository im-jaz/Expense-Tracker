// api.js
// Everything that talks to the exchange rate REST API lives here.

const API_URL = 'https://open.er-api.com/v6/latest';

/**
 * Fetch the latest exchange rates for a base currency.
 * Example: fetchRates('USD') -> { USD: 1, EUR: 0.92, KES: 129, ... }
 *
 * Throws an Error with a friendly message if anything goes wrong,
 * so the caller can show it to the user.
 */
export async function fetchRates(baseCurrency) {
  let response;

  // 1. Network problems (offline, blocked, DNS...) make fetch() throw
  try {
    response = await fetch(`${API_URL}/${baseCurrency}`);
  } catch {
    throw new Error('Could not reach the exchange rate service. Check your internet connection.');
  }

  // 2. The server answered, but with an error status (404, 500, ...)
  if (!response.ok) {
    throw new Error(`Exchange rate service returned an error (${response.status}).`);
  }

  // 3. The body must be valid JSON
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Received an unreadable response from the exchange rate service.');
  }

  // 4. This API puts "success" in data.result
  if (data.result !== 'success' || !data.rates) {
    throw new Error('The exchange rate service did not return any rates.');
  }

  return data.rates;
}