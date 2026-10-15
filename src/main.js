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

// ----- Event handlers -----

function handleSubmit() {
  const { id, ...data } = readTransactionForm();

  const problem = validateTransaction(data);
  if (problem) {
    showFormMessage(problem);
    return;
  }

  let message;
  if (id === null) {
    addTransaction(data);
    message = 'Transaction added.';
  } else {
    updateTransaction(id, data);
    message = 'Transaction updated.';
  }

  setState({ editingId: null });
  resetForm(); // clears the form (and the message), so show the message after
  showFormMessage(message);
  render();
}

function handleEdit(id) {
  const transaction = getState().transactions.find((item) => item.id === id);
  if (!transaction) return;
  setState({ editingId: id });
  fillFormForEdit(transaction);
}

function handleCancelEdit() {
  setState({ editingId: null });
  resetForm();
  showFormMessage('');
}

function handleDelete(id) {
  removeTransaction(id);
  // If the deleted transaction was being edited, leave edit mode
  if (getState().editingId === id) {
    handleCancelEdit();
  }
  render();
}

function handleCurrencyChange(currency) {
  setState({ displayCurrency: currency, rates: {} });
  loadRates();
}

function handleFilterChange(changes) {
  setFilters(changes);
  render();
}

function handleConvert() {
  const { amount, from, to } = readConversionForm();

  if (!Number.isFinite(amount) || amount < 0) {
    showConversionResult('Please enter a valid amount.');
    return;
  }

  const result = convertAmount(amount, from, to, getState().rates);
  if (result === null) {
    showConversionResult('Exchange rates are not available right now. Please try again.');
    return;
  }
  showConversionResult(`${formatMoney(amount, from)} = ${formatMoney(result, to)}`);
}

// ----- Start the app -----

initUI(getState().displayCurrency);
bindEvents({
  onSubmit: handleSubmit,
  onCancelEdit: handleCancelEdit,
  onCurrencyChange: handleCurrencyChange,
  onFilterChange: handleFilterChange,
  onConvert: handleConvert,
});
loadRates();

