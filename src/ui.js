// ui.js
// Everything that touches the page (DOM) lives here.
// This file only DISPLAYS data: it never decides what the data is.

import { BASE_CURRENCY, convertAmount, formatMoney, formatDate } from './utils.js';

// Grab the elements once so we don't search the page again and again
const el = {
  displayCurrency: document.getElementById('display-currency'),
  totalBalance: document.getElementById('total-balance'),
  totalIncome: document.getElementById('total-income'),
  totalExpenses: document.getElementById('total-expenses'),
  form: document.getElementById('transaction-form'),
  id: document.getElementById('transaction-id'),
  type: document.getElementById('transaction-type'),
  description: document.getElementById('transaction-description'),
  amount: document.getElementById('transaction-amount'),
  category: document.getElementById('transaction-category'),
  date: document.getElementById('transaction-date'),
  saveBtn: document.getElementById('save-transaction'),
  cancelBtn: document.getElementById('cancel-edit'),
  formMessage: document.getElementById('transaction-message'),
  search: document.getElementById('transaction-search'),
  categoryFilter: document.getElementById('category-filter'),
  typeFilter: document.getElementById('type-filter'),
  list: document.getElementById('transaction-list'),
  empty: document.getElementById('transaction-empty'),
  conversionForm: document.getElementById('conversion-form'),
  conversionAmount: document.getElementById('conversion-amount'),
  fromCurrency: document.getElementById('from-currency'),
  toCurrency: document.getElementById('to-currency'),
  convertedAmount: document.getElementById('converted-amount'),
  exchangeStatus: document.getElementById('exchange-status'),
};

// ---------- Summary cards ----------

// totals is null when we cannot convert yet (no rates): show "—" instead of 0
export function renderTotals(totals, displayCurrency) {
  const show = (value) =>
    totals === null ? '—' : formatMoney(value, displayCurrency);
  el.totalBalance.textContent = show(totals && totals.balance);
  el.totalIncome.textContent = show(totals && totals.income);
  el.totalExpenses.textContent = show(totals && totals.expenses);
}

// ---------- Exchange rate status (loading / error) ----------

export function renderStatus(loading, error) {
  if (loading) {
    el.exchangeStatus.textContent = 'Loading live exchange rates…';
  } else if (error) {
    el.exchangeStatus.textContent = `${error} Amounts in other currencies show "—" until rates load.`;
  } else {
    el.exchangeStatus.textContent = 'Live exchange rates loaded.';
  }
}