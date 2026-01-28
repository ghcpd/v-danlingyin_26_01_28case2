import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../data/mockData';
import './Budget.css';

export default function Budget() {
  const { budgets, updateBudget, getCategorySpending } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const categorySpending = getCategorySpending(selectedYear, selectedMonth);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2025, 2026];

  const monthName = `${months[selectedMonth]} ${selectedYear}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleEditStart = (category, currentLimit) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const handleEditSave = (category) => {
    const value = parseFloat(editValue);
    if (!isNaN(value) && value >= 0) {
      updateBudget(category, value);
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCategory(null);
    setEditValue('');
  };

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

  const totalBudget = categorySpending.reduce((sum, c) => sum + c.limit, 0);
  const totalSpent = categorySpending.reduce((sum, c) => sum + c.spent, 0);
  const overBudgetCount = categorySpending.filter(c => c.isOverBudget).length;

  return (
    <div className="budget-page">
      <div className="page-header">
        <div>
          <h1>Budget Management</h1>
          <p className="subtitle">Set and track your monthly spending limits</p>
        </div>
        <div className="month-selector">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="budget-summary">
        <div className="summary-item">
          <span className="summary-label">Total Budget</span>
          <span className="summary-value">{formatCurrency(totalBudget)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Spent</span>
          <span className={`summary-value ${totalSpent > totalBudget ? 'over' : ''}`}>
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className={`summary-value ${totalBudget - totalSpent < 0 ? 'over' : 'under'}`}>
            {formatCurrency(totalBudget - totalSpent)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Categories Over Budget</span>
          <span className={`summary-value ${overBudgetCount > 0 ? 'warning' : ''}`}>
            {overBudgetCount}
          </span>
        </div>
      </div>

      <div className="budget-list">
        <div className="budget-header">
          <span>Category</span>
          <span>Budget</span>
          <span>Spent</span>
          <span>Remaining</span>
          <span>Progress</span>
          <span>Actions</span>
        </div>

        {categorySpending.map(item => (
          <div 
            key={item.category} 
            className={`budget-row ${item.isOverBudget ? 'over-budget' : ''}`}
          >
            <div className="category-cell">
              <span 
                className="category-indicator"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              ></span>
              <span className="category-name">{item.category}</span>
            </div>

            <div className="budget-cell">
              {editingCategory === item.category ? (
                <input
                  type="number"
                  className="budget-input"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEditSave(item.category);
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                  autoFocus
                />
              ) : (
                <span className="budget-amount">{formatCurrency(item.limit)}</span>
              )}
            </div>

            <div className="spent-cell">
              <span className={item.isOverBudget ? 'over' : ''}>
                {formatCurrency(item.spent)}
              </span>
            </div>

            <div className="remaining-cell">
              <span className={item.remaining < 0 ? 'negative' : 'positive'}>
                {formatCurrency(item.remaining)}
              </span>
            </div>

            <div className="progress-cell">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${item.percentage > 100 ? 'over' : item.percentage > 80 ? 'warning' : ''}`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
              <span className={`progress-text ${item.percentage > 100 ? 'over' : ''}`}>
                {item.percentage.toFixed(0)}%
              </span>
            </div>

            <div className="actions-cell">
              {editingCategory === item.category ? (
                <>
                  <button 
                    className="btn-icon save"
                    onClick={() => handleEditSave(item.category)}
                    title="Save"
                  >
                    ✓
                  </button>
                  <button 
                    className="btn-icon cancel"
                    onClick={handleEditCancel}
                    title="Cancel"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button 
                  className="btn-icon edit"
                  onClick={() => handleEditStart(item.category, item.limit)}
                  title="Edit Budget"
                >
                  ✏️
                </button>
              )}
            </div>

            {item.isOverBudget && (
              <div className="over-budget-alert">
                ⚠️ Over budget by {formatCurrency(Math.abs(item.remaining))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="budget-tips">
        <h3>💡 Budget Tips for {monthName}</h3>
        <ul>
          {overBudgetCount > 0 && (
            <li className="tip-warning">
              You have {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'} over budget. 
              Consider reviewing your spending in those areas.
            </li>
          )}
          {categorySpending
            .filter(c => c.percentage >= 80 && c.percentage < 100)
            .map(c => (
              <li key={c.category} className="tip-caution">
                <strong>{c.category}</strong> is at {c.percentage.toFixed(0)}% of budget. 
                You have {formatCurrency(c.remaining)} left.
              </li>
            ))
          }
          {totalSpent < totalBudget * 0.5 && (
            <li className="tip-success">
              Great job! You've used less than half of your total budget.
            </li>
          )}
        </ul>
      </div>

      <div className="budget-explanation">
        <h3>📊 How Budget Usage is Calculated</h3>
        <div className="explanation-content">
          <p>
            Budget usage is calculated by comparing your <strong>actual spending</strong> in each 
            category against the <strong>monthly limit</strong> you've set for that category.
          </p>
          <ul>
            <li><strong>Percentage Used:</strong> (Spent Amount ÷ Budget Limit) × 100</li>
            <li><strong>Remaining:</strong> Budget Limit - Spent Amount</li>
            <li><strong>Over Budget:</strong> Highlighted in red when spending exceeds the limit</li>
          </ul>
          <p>
            The progress bar visually represents usage: <span className="legend green">green (0-80%)</span>, 
            <span className="legend yellow"> yellow (80-100%)</span>, and 
            <span className="legend red"> red (over 100%)</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
