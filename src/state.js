// state.js
// The single place where app data is stored.
// We NEVER change the old state directly. Instead we build a new
// copy with the spread operator (...) and replace the old one.

let nextId = 1;

let state = {
  transactions: [], // array of { id, type, description, amount, category, date }
  displayCurrency: 'KES', // currency used to show totals and amounts
  rates: {}, // exchange rates based on displayCurrency
  filters: { search: '', category: 'all', type: 'all' },
  editingId: null, // id of the transaction being edited, or null
  loading: false,
  error: null, // error message string, or null
};

export function getState() {
  return state;
}

// Merge changed fields into the state (spread: copy old state, overwrite changes)
export function setState(changes) {
  state = { ...state, ...changes };
}

// Update only some of the filters, keeping the others
export function setFilters(changes) {
  state = { ...state, filters: { ...state.filters, ...changes } };
}