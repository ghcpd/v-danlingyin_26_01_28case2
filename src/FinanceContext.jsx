import React, { createContext, useContext, useState } from 'react';
import { initialData } from './data';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState(initialData.incomes);
  const [expenses, setExpenses] = useState(initialData.expenses);
  const [budgets, setBudgets] = useState(initialData.budgets);

  // Add income
  const addIncome = (income) => {
    const newIncome = {
      id: Date.now(),
      ...income,
      date: new Date(income.date).toISOString()
    };
    setIncomes([...incomes, newIncome]);
  };

  // Add expense
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: new Date(expense.date).toISOString()
    };
    setExpenses([...expenses, newExpense]);
  };

  // Update budget
  const updateBudget = (category, monthlyLimit) => {
    setBudgets(budgets.map(b => 
      b.category === category ? { ...b, monthlyLimit } : b
    ));
  };

  // Calculate totals
  const getTotalIncome = (month = null, year = null) => {
    let filtered = incomes;
    if (month !== null && year !== null) {
      filtered = incomes.filter(inc => {
        const date = new Date(inc.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    return filtered.reduce((sum, inc) => sum + inc.amount, 0);
  };

  const getTotalExpense = (month = null, year = null) => {
    let filtered = expenses;
    if (month !== null && year !== null) {
      filtered = expenses.filter(exp => {
        const date = new Date(exp.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    return filtered.reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Get expenses by category for a specific month/year
  const getExpensesByCategory = (category, month, year) => {
    return expenses.filter(exp => {
      const date = new Date(exp.date);
      const matchesCategory = exp.category === category;
      const matchesMonth = date.getMonth() === month;
      const matchesYear = date.getFullYear() === year;
      return matchesCategory && matchesMonth && matchesYear;
    });
  };

  const getCategoryTotal = (category, month, year) => {
    return getExpensesByCategory(category, month, year)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const value = {
    incomes,
    expenses,
    budgets,
    addIncome,
    addExpense,
    updateBudget,
    getTotalIncome,
    getTotalExpense,
    getExpensesByCategory,
    getCategoryTotal
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
