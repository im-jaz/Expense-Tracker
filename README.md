# SmartFund

SmartFund is a web-based expense tracker. It helps users manage their income and expenses, view financial summaries, filter transactions, and convert amounts between different currencies.

The application features a simple, responsive dashboard with a dark theme, clear financial summaries, and an easy-to-use interface.

## Features

- **Financial Dashboard:** Displays total balance, income, and expenses.
- **Transaction Management:** Add, edit, and manage income and expense transactions.
- **Transaction History:** View transaction descriptions, categories, dates, and amounts.
- **Search and Filtering:** Search transactions and filter them by category and transaction type.
- **Currency Selection:** Choose a preferred display currency.
- **Currency Conversion:** Retrieve exchange rates from a REST API and convert amounts between supported currencies.
- **Error Handling:** Handles unsuccessful API requests and provides appropriate feedback.
- **Responsive Design:** Adapts the interface to different screen sizes.
- **Modular JavaScript:** Organizes application logic into separate modules using ES Modules.
- **Unit Testing:** Uses Jest to test utility functions.
- **Code Quality:** Uses ESLint to identify potential errors and maintain code quality.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules)
- Fetch API and `async/await`
- ExchangeRate-API — exchange rate data
- Jest — unit testing
- ESLint — code linting
- Node.js and npm

## Exchange Rate API

Pennywise uses the Open ER API endpoint:

`https://open.er-api.com/v6/latest`

The API provides exchange rates that the application can use for currency conversion. The application handles API requests asynchronously and accounts for unsuccessful responses.

## Supported Currencies

- Kenyan Shilling (KES)
- United States Dollar (USD)
- Euro (EUR)
- British Pound (GBP)

Transaction amounts are stored in Kenyan shillings (KES), while the application supports displaying or converting amounts into other supported currencies.

## JavaScript Concepts Demonstrated

- **ES Modules:** Uses `import` and `export` to organize code across multiple files.
- **Spread Operator:** Updates arrays and objects without directly modifying existing data.
- **Arrays of Objects:** Represents transactions using structured data.
- **Array Methods:** Uses `map()`, `filter()`, and `reduce()` to process transactions, filter results, and calculate financial totals.
- **Asynchronous JavaScript:** Uses `fetch()` and `async/await` to retrieve exchange rates and handle errors.

## Project Structure

```text
expense-tracker/
├── index.html
├── style.css
├── src/
│   ├── api.js
│   ├── state.js
│   ├── utils.js
│   ├── ui.js
│   └── main.js
├── tests/
│   └── utils.test.js
├── package.json
├── package-lock.json
├── eslint.config.js
├── License
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- A modern web browser

### Installation

1. Clone the repository 


```bash
git clone git@github.com:im-jaz/SmartFund.git
```

2. Open the project folder in your terminal.

3. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

Start the local HTTP server:

```bash
npm start
```

Then open `index.html` in your browser.

### Running Tests

Run the Jest test suite:

```bash
npm test
```

### Running ESLint

Run the linter:

```bash
npm run lint
```

## Testing and Code Quality

Jest is used to test utility functions, including transaction calculations, currency conversion, and filtering. ESLint checks the JavaScript code for potential errors and consistency.

## Purpose of the Project

This project demonstrates foundational web development concepts, including responsive interface design, DOM manipulation, modular JavaScript, array methods, asynchronous API requests, unit testing, and code quality practices.

## Live Demo

View the live website here :

https://im-jaz.github.io/SmartFund/

## Authors

**Jazmine Amunga & Collins Korir**

A collaborative front-end development project built with HTML, CSS, and JavaScript.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

