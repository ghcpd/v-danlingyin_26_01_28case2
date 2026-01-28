// Data models and initial state

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Housing',
  'Other'
];

// Generate mock data for demonstration
const generateMockData = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const incomes = [
    { id: 1, amount: 5000, source: 'Salary', date: new Date(currentYear, currentMonth, 1).toISOString() },
    { id: 2, amount: 500, source: 'Freelance', date: new Date(currentYear, currentMonth, 15).toISOString() },
    { id: 3, amount: 4500, source: 'Salary', date: new Date(currentYear, currentMonth - 1, 1).toISOString() }
  ];

  const expenses = [
    { id: 1, amount: 450, category: 'Food & Dining', date: new Date(currentYear, currentMonth, 5).toISOString(), note: 'Groceries and restaurants' },
    { id: 2, amount: 120, category: 'Transportation', date: new Date(currentYear, currentMonth, 7).toISOString(), note: 'Gas and metro' },
    { id: 3, amount: 800, category: 'Housing', date: new Date(currentYear, currentMonth, 1).toISOString(), note: 'Rent payment' },
    { id: 4, amount: 200, category: 'Shopping', date: new Date(currentYear, currentMonth, 10).toISOString(), note: 'Clothing' },
    { id: 5, amount: 150, category: 'Entertainment', date: new Date(currentYear, currentMonth, 12).toISOString(), note: 'Movies and games' },
    { id: 6, amount: 80, category: 'Utilities', date: new Date(currentYear, currentMonth, 3).toISOString(), note: 'Electricity and water' },
    { id: 7, amount: 350, category: 'Food & Dining', date: new Date(currentYear, currentMonth, 18).toISOString(), note: 'Restaurant week' },
    { id: 8, amount: 100, category: 'Healthcare', date: new Date(currentYear, currentMonth, 20).toISOString(), note: 'Pharmacy' },
    // Previous month expenses
    { id: 9, amount: 400, category: 'Food & Dining', date: new Date(currentYear, currentMonth - 1, 5).toISOString(), note: 'Monthly groceries' },
    { id: 10, amount: 800, category: 'Housing', date: new Date(currentYear, currentMonth - 1, 1).toISOString(), note: 'Rent payment' }
  ];

  const budgets = [
    { category: 'Food & Dining', monthlyLimit: 600 },
    { category: 'Transportation', monthlyLimit: 200 },
    { category: 'Shopping', monthlyLimit: 300 },
    { category: 'Entertainment', monthlyLimit: 200 },
    { category: 'Healthcare', monthlyLimit: 150 },
    { category: 'Utilities', monthlyLimit: 100 },
    { category: 'Housing', monthlyLimit: 1000 },
    { category: 'Other', monthlyLimit: 100 }
  ];

  return { incomes, expenses, budgets };
};

export const initialData = generateMockData();
