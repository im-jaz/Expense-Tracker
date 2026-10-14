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

// ---------- Transactions table ----------

// Helper: make a table cell with some text
function makeCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text; // textContent is safe from HTML injection
  return cell;
}

// Helper: make a button for the Actions column
function makeButton(label, ariaLabel, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', onClick);
  return button;
}

// handlers = { onEdit(id), onDelete(id) }
export function renderTransactions(transactions, displayCurrency, rates, handlers) {
  el.list.innerHTML = '';
  el.empty.hidden = transactions.length > 0;

  transactions.forEach((transaction) => {
    const converted = convertAmount(
      transaction.amount,
      BASE_CURRENCY,
      displayCurrency,
      rates
    );
    const sign = transaction.type === 'income' ? '+' : '-';

    const row = document.createElement('tr');
    row.append(
      makeCell(transaction.description),
      makeCell(transaction.category),
      makeCell(formatDate(transaction.date))
    );

    // Amount: converted value, with the original amount as a tooltip
    const amountCell = makeCell(
      converted === null ? '—' : `${sign}${formatMoney(converted, displayCurrency)}`
    );
    amountCell.title = `${sign}${formatMoney(transaction.amount, BASE_CURRENCY)}`;
    row.appendChild(amountCell);

    // Actions: edit and delete
    const actions = document.createElement('td');
    actions.append(
      makeButton('Edit', `Edit ${transaction.description}`, () =>
        handlers.onEdit(transaction.id)
      ),
      makeButton('Delete', `Delete ${transaction.description}`, () =>
        handlers.onDelete(transaction.id)
      )
    );
    row.appendChild(actions);

    el.list.appendChild(row);
  });
}

// ---------- Transaction form ----------

export function readTransactionForm() {
  return {
    id: el.id.value === '' ? null : Number(el.id.value),
    type: el.type.value,
    description: el.description.value.trim(),
    amount: Number(el.amount.value),
    category: el.category.value,
    date: el.date.value,
  };
}

export function showFormMessage(message) {
  el.formMessage.textContent = message;
}

// Today's date in the user's own time zone, as yyyy-mm-dd
// (toISOString would use UTC and give yesterday's date after midnight in Kenya)
function todayAsIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Clear the form and go back to "add" mode
export function resetForm() {
  el.form.reset();
  el.id.value = '';
  el.date.value = todayAsIso();
  el.saveBtn.textContent = 'Add Transaction';
  el.cancelBtn.hidden = true;
}

// Put a transaction into the form and switch to "edit" mode
export function fillFormForEdit(transaction) {
  el.id.value = transaction.id;
  el.type.value = transaction.type;
  el.description.value = transaction.description;
  el.amount.value = transaction.amount;
  el.category.value = transaction.category;
  el.date.value = transaction.date;
  el.saveBtn.textContent = 'Save Changes';
  el.cancelBtn.hidden = false;
  el.formMessage.textContent = '';
  el.description.focus();
}

// ---------- Currency converter ----------

export function readConversionForm() {
  return {
    amount: Number(el.conversionAmount.value),
    from: el.fromCurrency.value,
    to: el.toCurrency.value,
  };
}

export function showConversionResult(text) {
  el.convertedAmount.textContent = text;
}

// ---------- Start-up and events ----------

export function initUI(displayCurrency) {
  el.displayCurrency.value = displayCurrency;
  el.date.value = todayAsIso();
}

// Let main.js attach event listeners without exposing every element
export function bindEvents(handlers) {
  el.form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the page from reloading
    handlers.onSubmit();
  });
  el.cancelBtn.addEventListener('click', handlers.onCancelEdit);

  el.displayCurrency.addEventListener('change', () =>
    handlers.onCurrencyChange(el.displayCurrency.value)
  );

  el.search.addEventListener('input', () =>
    handlers.onFilterChange({ search: el.search.value })
  );
  el.categoryFilter.addEventListener('change', () =>
    handlers.onFilterChange({ category: el.categoryFilter.value })
  );
  el.typeFilter.addEventListener('change', () =>
    handlers.onFilterChange({ type: el.typeFilter.value })
  );

  el.conversionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handlers.onConvert();
  });
}