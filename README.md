# Personal Finance & Budget Planner

A comprehensive web application for tracking income, expenses, and managing monthly budgets.

## Features

### 1. Overview Page
- Displays total income, total expenses, and remaining balance for the current month
- Shows all-time financial summary
- Lists recent income and expense transactions
- Ability to add new income records

### 2. Expense Management
- Add new expenses with category, date, and notes
- Filter expenses by category, month, and year
- View expense breakdown by category
- Comprehensive expense list with all transaction details
- Visual summary of spending patterns

### 3. Budget Management
- Set monthly budget limits for each spending category
- View budget vs actual spending comparison
- Visual progress bars showing budget usage
- **Budget overrun indicators:**
  - Red progress bar when spending exceeds 100%
  - Red card border for over-budget categories
  - Warning notification showing overspend amount
  - Orange progress bar when spending is between 80-100%
  - Clear percentage display of budget usage

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Context API** - State management
- **CSS3** - Styling with responsive design

## Data Models

### Income
```javascript
{
  id: Number,
  amount: Number,
  source: String,
  date: ISO Date String
}
```

### Expense
```javascript
{
  id: Number,
  amount: Number,
  category: String,
  date: ISO Date String,
  note: String
}
```

### Budget
```javascript
{
  category: String,
  monthlyLimit: Number
}
```

## Budget Calculation Logic

The application calculates budget usage as follows:

1. **Budget Usage Percentage**: `(Total Spent / Monthly Limit) × 100`
2. **Remaining Amount**: `Monthly Limit - Total Spent`
3. **Visual Indicators**:
   - Green: Under 80% of budget
   - Orange/Warning: 80-100% of budget
   - Red: Over 100% of budget (overrun)
4. **Scope**: All calculations are performed for the selected month and year

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Project Structure

```
src/
├── pages/
│   ├── Overview.jsx           # Overview dashboard
│   ├── Overview.css
│   ├── ExpenseManagement.jsx  # Expense tracking page
│   ├── ExpenseManagement.css
│   ├── BudgetManagement.jsx   # Budget management page
│   └── BudgetManagement.css
├── App.jsx                    # Main app with navigation
├── App.css                    # Global styles
├── FinanceContext.jsx         # State management
├── data.js                    # Data models and mock data
└── main.jsx                   # App entry point
```

## Key Features Explained

### Session Persistence
- All data is stored in React state (in-memory)
- Data persists during the browser session
- Mock data is provided for demonstration purposes

### Visual Budget Indicators
- **Progress Bars**: Show exact percentage of budget used
- **Color Coding**: Immediate visual feedback on spending status
- **Over-Budget Warnings**: Clear alerts when limits are exceeded
- **Card Borders**: Red borders highlight problem categories

### Realistic User Experience
- Form validation for all inputs
- Date pickers for accurate record keeping
- Category-based organization
- Month/year filtering for historical data
- Responsive design for desktop use

## Categories

The application supports 8 predefined categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Healthcare
- Utilities
- Housing
- Other

## Usage Tips

1. Start by reviewing the Overview page to see your current financial status
2. Add income records as they occur
3. Track expenses in the Expense Management page with detailed notes
4. Set realistic budget limits in the Budget Management page
5. Monitor budget usage regularly to avoid overspending
6. Use filters to analyze spending patterns by month and category
