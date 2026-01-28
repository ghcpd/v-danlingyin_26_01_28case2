import React, { useState } from 'react';
import { useFinance } from '../FinanceContext';
import { CATEGORIES } from '../data';
import './ExpenseManagement.css';

const ExpenseManagement = () => {
  const { expenses, addExpense } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (expenseForm.amount && expenseForm.category) {
      addExpense({
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        date: expenseForm.date,
        note: expenseForm.note
      });
      setExpenseForm({
        amount: '',
        category: CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      setShowForm(false);
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesMonth = date.getMonth() === selectedMonth;
    const matchesYear = date.getFullYear() === selectedYear;
    return matchesCategory && matchesMonth && matchesYear;
  });

  // Calculate category totals for current filters
  const categoryTotals = CATEGORIES.map(cat => {
    const total = filteredExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category: cat, total };
  }).filter(ct => ct.total > 0);

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get unique years from expenses
  const years = [...new Set(expenses.map(exp => new Date(exp.date).getFullYear()))].sort((a, b) => b - a);

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="expense-management-container">
      <div className="expense-header">
        <h1>Expense Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div className="expense-form-card">
          <h3>Add New Expense</h3>
          <form onSubmit={handleAddExpense}>
            <div className="form-row">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Note (optional)</label>
              <input
                type="text"
                value={expenseForm.note}
                onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                placeholder="Add a note about this expense"
              />
            </div>
            <button type="submit" className="btn-primary">Add Expense</button>
          </form>
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="expense-summary">
        <h2>Summary for {monthName}</h2>
        <div className="summary-grid">
          <div className="summary-total-card">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">${totalFiltered.toFixed(2)}</div>
          </div>
          {categoryTotals.length > 0 && (
            <div className="category-breakdown">
              <h3>By Category:</h3>
              <div className="category-list">
                {categoryTotals.map(ct => (
                  <div key={ct.category} className="category-total-item">
                    <span className="category-name">{ct.category}</span>
                    <span className="category-amount">${ct.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="expense-list-section">
        <h2>Expense List ({filteredExpenses.length} items)</h2>
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found for the selected filters.</p>
          </div>
        ) : (
          <div className="expense-table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredExpenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(expense => (
                    <tr key={expense.id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>
                        <span className="category-badge">{expense.category}</span>
                      </td>
                      <td className="amount-cell">${expense.amount.toFixed(2)}</td>
                      <td className="note-cell">{expense.note || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseManagement;
