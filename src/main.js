// main.js
// The "conductor": connects state, API, utils and UI together.

import { fetchRates } from './api.js';
import {
  getState,
  setState,
  setFilters,
  addTransaction,
  updateTransaction,
  removeTransaction,
} from './state.js';
import {
  BASE_CURRENCY,
  calculateTotals,
  filterTransactions,
  sortByNewest,
  validateTransaction,
  convertAmount,
  formatMoney,
} from './utils.js';
import {
  initUI,
  renderTotals,
  renderStatus,
  renderTransactions,
  readTransactionForm,
  showFormMessage,
  resetForm,
  fillFormForEdit,
  readConversionForm,
  showConversionResult,
  bindEvents,
} from './ui.js';

// Redraw the whole page from the current state
function render() {
  const { transactions, filters, displayCurrency, rates, loading, error } = getState();
  const visible = sortByNewest(filterTransactions(transactions, filters));

  renderStatus(loading, error);
  // Totals cover ALL transactions; the table respects the filters.
  // Without rates we cannot convert to another currency, so show "—".
  const canConvert = displayCurrency === BASE_CURRENCY || rates[BASE_CURRENCY] !== undefined;
  renderTotals(
    canConvert ? calculateTotals(transactions, displayCurrency, rates) : null,
    displayCurrency
  );
  renderTransactions(visible, displayCurrency, rates, {
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
}

// Fetch rates for the current display currency (async/await)
async function loadRates() {
  const requestedCurrency = getState().displayCurrency;
  setState({ loading: true, error: null });
  render();

  try {
    const rates = await fetchRates(requestedCurrency);
    // The user may have switched currency while we waited: ignore old answers
    if (requestedCurrency !== getState().displayCurrency) return;
    setState({ rates, loading: false });
  } catch (error) {
    if (requestedCurrency !== getState().displayCurrency) return;
    setState({ rates: {}, loading: false, error: error.message });
  }
  render();
}