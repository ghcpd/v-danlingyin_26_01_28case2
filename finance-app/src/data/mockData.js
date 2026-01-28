// Mock data for the Personal Finance & Budget Planner

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Personal Care',
  'Education',
  'Other'
];

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Investment',
  'Rental',
  'Business',
  'Gift',
  'Other'
];

// Initial mock income data
export const initialIncomes = [
  { id: 1, amount: 5000, source: 'Salary', date: '2026-01-15' },
  { id: 2, amount: 1200, source: 'Freelance', date: '2026-01-20' },
  { id: 3, amount: 300, source: 'Investment', date: '2026-01-25' },
  { id: 4, amount: 4800, source: 'Salary', date: '2025-12-15' },
  { id: 5, amount: 500, source: 'Freelance', date: '2025-12-22' },
];

// Initial mock expense data
export const initialExpenses = [
  { id: 1, amount: 1500, category: 'Housing', date: '2026-01-01', note: 'Monthly rent' },
  { id: 2, amount: 200, category: 'Utilities', date: '2026-01-05', note: 'Electric & water bills' },
  { id: 3, amount: 450, category: 'Food & Dining', date: '2026-01-10', note: 'Groceries' },
  { id: 4, amount: 120, category: 'Transportation', date: '2026-01-12', note: 'Gas and transit' },
  { id: 5, amount: 80, category: 'Entertainment', date: '2026-01-15', note: 'Netflix and Spotify' },
  { id: 6, amount: 250, category: 'Shopping', date: '2026-01-18', note: 'Clothing' },
  { id: 7, amount: 150, category: 'Healthcare', date: '2026-01-20', note: 'Doctor visit' },
  { id: 8, amount: 300, category: 'Food & Dining', date: '2026-01-22', note: 'Dining out' },
  { id: 9, amount: 1400, category: 'Housing', date: '2025-12-01', note: 'Monthly rent' },
  { id: 10, amount: 180, category: 'Utilities', date: '2025-12-05', note: 'Electric & water bills' },
  { id: 11, amount: 380, category: 'Food & Dining', date: '2025-12-10', note: 'Groceries' },
  { id: 12, amount: 600, category: 'Shopping', date: '2025-12-20', note: 'Holiday gifts' },
];

// Initial budget data (monthly limits per category)
export const initialBudgets = [
  { category: 'Housing', monthlyLimit: 1600 },
  { category: 'Transportation', monthlyLimit: 300 },
  { category: 'Food & Dining', monthlyLimit: 600 },
  { category: 'Utilities', monthlyLimit: 250 },
  { category: 'Healthcare', monthlyLimit: 200 },
  { category: 'Entertainment', monthlyLimit: 150 },
  { category: 'Shopping', monthlyLimit: 200 },
  { category: 'Personal Care', monthlyLimit: 100 },
  { category: 'Education', monthlyLimit: 150 },
  { category: 'Other', monthlyLimit: 100 },
];
