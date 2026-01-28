import { createContext, useContext, useState, useMemo } from 'react';
import {
  initialIncomes,
  initialExpenses,
  initialBudgets,
  EXPENSE_CATEGORIES
} from '../data/mockData';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [incomes, setIncomes] = useState(initialIncomes);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budgets, setBudgets] = useState(initialBudgets);

  // Generate unique ID
  const generateId = () => Date.now() + Math.random();

  // Income operations
  const addIncome = (income) => {
    setIncomes(prev => [...prev, { ...income, id: generateId() }]);
  };

  const deleteIncome = (id) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  // Expense operations
  const addExpense = (expense) => {
    setExpenses(prev => [...prev, { ...expense, id: generateId() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Budget operations
  const updateBudget = (category, monthlyLimit) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, monthlyLimit } : b);
      }
      return [...prev, { category, monthlyLimit }];
    });
  };

  // Calculate totals for a specific month
  const getMonthlyStats = (year, month) => {
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const monthIncomes = incomes.filter(i => {
      const d = new Date(i.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance, monthExpenses, monthIncomes };
  };

  // Calculate spending by category for a specific month
  const getCategorySpending = (year, month) => {
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return EXPENSE_CATEGORIES.map(category => {
      const spent = monthExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      const budget = budgets.find(b => b.category === category);
      const limit = budget ? budget.monthlyLimit : 0;
      const isOverBudget = spent > limit && limit > 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category,
        spent,
        limit,
        isOverBudget,
        percentage,
        remaining: limit - spent
      };
    });
  };

  // Get expenses filtered by category and/or month
  const getFilteredExpenses = (filters = {}) => {
    let filtered = [...expenses];

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(e => e.category === filters.category);
    }

    if (filters.year !== undefined && filters.month !== undefined) {
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === filters.year && d.getMonth() === filters.month;
      });
    }

    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const value = useMemo(() => ({
    incomes,
    expenses,
    budgets,
    addIncome,
    deleteIncome,
    addExpense,
    deleteExpense,
    updateBudget,
    getMonthlyStats,
    getCategorySpending,
    getFilteredExpenses
  }), [incomes, expenses, budgets]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
