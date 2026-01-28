import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../data/mockData';
import './Expenses.css';

export default function Expenses() {
  const { addExpense, deleteExpense, getFilteredExpenses } = useFinance();
  
  const now = new Date();
  const [filters, setFilters] = useState({
    category: 'All',
    year: now.getFullYear(),
    month: now.getMonth()
  });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food & Dining',
    date: now.toISOString().split('T')[0],
    note: ''
  });

  const expenses = getFilteredExpenses(filters);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2025, 2026];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) return;

    addExpense({
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      note: newExpense.note
    });
    setNewExpense({
      amount: '',
      category: 'Food & Dining',
      date: now.toISOString().split('T')[0],
      note: ''
    });
    setShowAddExpense(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalFiltered = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategoryColor = (category) => {
    const colors = {
      'Housing': '#3b82f6',
      'Transportation': '#8b5cf6',
      'Food & Dining': '#f59e0b',
      'Utilities': '#06b6d4',
      'Healthcare': '#ef4444',
      'Entertainment': '#ec4899',
      'Shopping': '#10b981',
      'Personal Care': '#f97316',
      'Education': '#6366f1',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div>
          <h1>Expense Management</h1>
          <p className="subtitle">Track and manage your expenses</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddExpense(true)}>
          + Add Expense
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Month</label>
          <select
            value={filters.month}
            onChange={e => setFilters({...filters, month: parseInt(e.target.value)})}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year</label>
          <select
            value={filters.year}
            onChange={e => setFilters({...filters, year: parseInt(e.target.value)})}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-summary">
          <span className="summary-label">Total:</span>
          <span className="summary-amount">{formatCurrency(totalFiltered)}</span>
          <span className="summary-count">({expenses.length} transactions)</span>
        </div>
      </div>

      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Expense</h3>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Note (optional)</label>
                <input
                  type="text"
                  value={newExpense.note}
                  onChange={e => setNewExpense({...newExpense, note: e.target.value})}
                  placeholder="Add a note"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddExpense(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No expenses found</h3>
            <p>No expenses match your current filters. Try changing the filters or add a new expense.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(expense.category) + '20', color: getCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="note-cell">{expense.note || '-'}</td>
                  <td className="amount-cell negative">{formatCurrency(expense.amount)}</td>
                  <td>
                    <button 
                      className="btn-icon delete"
                      onClick={() => deleteExpense(expense.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="category-breakdown">
        <h3>Category Breakdown</h3>
        <div className="breakdown-grid">
          {EXPENSE_CATEGORIES.map(category => {
            const categoryExpenses = expenses.filter(e => e.category === category);
            const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
            if (total === 0) return null;
            
            return (
              <div key={category} className="breakdown-item">
                <div className="breakdown-header">
                  <span 
                    className="category-dot"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></span>
                  <span className="breakdown-category">{category}</span>
                </div>
                <div className="breakdown-amount">{formatCurrency(total)}</div>
                <div className="breakdown-count">{categoryExpenses.length} transactions</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
