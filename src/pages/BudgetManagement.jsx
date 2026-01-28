import React, { useState } from 'react';
import { useFinance } from '../FinanceContext';
import './BudgetManagement.css';

const BudgetManagement = () => {
  const { budgets, updateBudget, getCategoryTotal } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleEditBudget = (category, currentLimit) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const handleSaveBudget = (category) => {
    if (editValue && parseFloat(editValue) >= 0) {
      updateBudget(category, parseFloat(editValue));
      setEditingCategory(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate budget data for each category
  const budgetData = budgets.map(budget => {
    const spent = getCategoryTotal(budget.category, selectedMonth, selectedYear);
    const remaining = budget.monthlyLimit - spent;
    const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
    const isOverBudget = spent > budget.monthlyLimit;

    return {
      ...budget,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      actualPercentage: percentage,
      isOverBudget
    };
  });

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="budget-management-container">
      <div className="budget-header">
        <h1>Budget Management</h1>
      </div>

      <div className="filters-section">
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
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overall-budget-summary">
        <h2>Overall Budget for {monthName}</h2>
        <div className="overall-stats">
          <div className="overall-stat-card">
            <div className="stat-label">Total Budget</div>
            <div className="stat-value">${totalBudget.toFixed(2)}</div>
          </div>
          <div className="overall-stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value spent">${totalSpent.toFixed(2)}</div>
          </div>
          <div className={`overall-stat-card ${totalRemaining < 0 ? 'over-budget' : ''}`}>
            <div className="stat-label">Remaining</div>
            <div className="stat-value">${totalRemaining.toFixed(2)}</div>
          </div>
          <div className="overall-stat-card">
            <div className="stat-label">Usage</div>
            <div className="stat-value">{totalPercentage.toFixed(1)}%</div>
          </div>
        </div>
        <div className="overall-progress-bar">
          <div 
            className={`overall-progress-fill ${totalPercentage > 100 ? 'over-budget' : totalPercentage > 80 ? 'warning' : ''}`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="budget-list-section">
        <h2>Budget by Category</h2>
        <div className="budget-cards">
          {budgetData.map(data => (
            <div key={data.category} className={`budget-card ${data.isOverBudget ? 'over-budget-card' : ''}`}>
              <div className="budget-card-header">
                <h3>{data.category}</h3>
                {editingCategory === data.category ? (
                  <div className="edit-controls">
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={() => handleSaveBudget(data.category)} className="btn-save">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEditBudget(data.category, data.monthlyLimit)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="budget-details">
                <div className="budget-row">
                  <span className="budget-label">Monthly Limit:</span>
                  <span className="budget-value">${data.monthlyLimit.toFixed(2)}</span>
                </div>
                <div className="budget-row">
                  <span className="budget-label">Spent:</span>
                  <span className="budget-value spent-value">${data.spent.toFixed(2)}</span>
                </div>
                <div className="budget-row">
                  <span className="budget-label">Remaining:</span>
                  <span className={`budget-value ${data.remaining < 0 ? 'negative' : 'positive'}`}>
                    ${data.remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Budget Usage</span>
                  <span className={`progress-percentage ${data.isOverBudget ? 'over-budget-text' : ''}`}>
                    {data.actualPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${data.isOverBudget ? 'over-budget' : data.percentage > 80 ? 'warning' : ''}`}
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                {data.isOverBudget && (
                  <div className="over-budget-warning">
                    ⚠️ Over budget by ${Math.abs(data.remaining).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-explanation">
        <h3>How Budget Usage is Calculated</h3>
        <ul>
          <li><strong>Budget Usage Percentage:</strong> Calculated as (Spent / Monthly Limit) × 100</li>
          <li><strong>Remaining Amount:</strong> Monthly Limit - Spent (negative values indicate over-budget)</li>
          <li><strong>Visual Indicators:</strong>
            <ul>
              <li>Green progress bar: Under 80% of budget</li>
              <li>Orange progress bar: Between 80% and 100% of budget</li>
              <li>Red progress bar: Over 100% of budget</li>
              <li>Red card border: Category is over budget</li>
            </ul>
          </li>
          <li><strong>Data Scope:</strong> All calculations are based on the selected month and year</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetManagement;
