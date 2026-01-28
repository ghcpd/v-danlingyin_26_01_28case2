import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { INCOME_SOURCES } from '../data/mockData';
import './Overview.css';

export default function Overview() {
  const { getMonthlyStats, incomes, addIncome, deleteIncome } = useFinance();
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [newIncome, setNewIncome] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0]
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const stats = getMonthlyStats(currentYear, currentMonth);
  const previousStats = getMonthlyStats(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!newIncome.amount || parseFloat(newIncome.amount) <= 0) return;
    
    addIncome({
      amount: parseFloat(newIncome.amount),
      source: newIncome.source,
      date: newIncome.date
    });
    setNewIncome({
      amount: '',
      source: 'Salary',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddIncome(false);
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

  // Calculate income trend
  const incomeTrend = previousStats.totalIncome > 0 
    ? ((stats.totalIncome - previousStats.totalIncome) / previousStats.totalIncome) * 100 
    : 0;

  const expenseTrend = previousStats.totalExpense > 0 
    ? ((stats.totalExpense - previousStats.totalExpense) / previousStats.totalExpense) * 100 
    : 0;

  return (
    <div className="overview">
      <div className="page-header">
        <h1>Financial Overview</h1>
        <p className="subtitle">{monthName}</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <div className="amount">{formatCurrency(stats.totalIncome)}</div>
            {incomeTrend !== 0 && (
              <div className={`trend ${incomeTrend >= 0 ? 'positive' : 'negative'}`}>
                {incomeTrend >= 0 ? '↑' : '↓'} {Math.abs(incomeTrend).toFixed(1)}% from last month
              </div>
            )}
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <div className="amount">{formatCurrency(stats.totalExpense)}</div>
            {expenseTrend !== 0 && (
              <div className={`trend ${expenseTrend <= 0 ? 'positive' : 'negative'}`}>
                {expenseTrend >= 0 ? '↑' : '↓'} {Math.abs(expenseTrend).toFixed(1)}% from last month
              </div>
            )}
          </div>
        </div>

        <div className={`summary-card balance ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">{stats.balance >= 0 ? '📈' : '📉'}</div>
          <div className="card-content">
            <h3>Remaining Balance</h3>
            <div className="amount">{formatCurrency(stats.balance)}</div>
            <div className="balance-status">
              {stats.balance >= 0 ? 'You\'re within budget!' : 'Spending exceeds income'}
            </div>
          </div>
        </div>
      </div>

      <div className="overview-section">
        <div className="section-header">
          <h2>Income Records</h2>
          <button className="btn-primary" onClick={() => setShowAddIncome(true)}>
            + Add Income
          </button>
        </div>

        {showAddIncome && (
          <div className="modal-overlay" onClick={() => setShowAddIncome(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Add New Income</h3>
              <form onSubmit={handleAddIncome}>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newIncome.amount}
                    onChange={e => setNewIncome({...newIncome, amount: e.target.value})}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={newIncome.source}
                    onChange={e => setNewIncome({...newIncome, source: e.target.value})}
                  >
                    {INCOME_SOURCES.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newIncome.date}
                    onChange={e => setNewIncome({...newIncome, date: e.target.value})}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddIncome(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Add Income</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="income-list">
          {stats.monthIncomes.length === 0 ? (
            <div className="empty-state">No income recorded this month</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthIncomes.map(income => (
                  <tr key={income.id}>
                    <td>{formatDate(income.date)}</td>
                    <td>
                      <span className="source-badge">{income.source}</span>
                    </td>
                    <td className="amount-cell positive">{formatCurrency(income.amount)}</td>
                    <td>
                      <button 
                        className="btn-icon delete"
                        onClick={() => deleteIncome(income.id)}
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
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Savings Rate</span>
          <span className="stat-value">
            {stats.totalIncome > 0 
              ? `${((stats.balance / stats.totalIncome) * 100).toFixed(1)}%`
              : '0%'
            }
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Daily Average Spending</span>
          <span className="stat-value">
            {formatCurrency(stats.totalExpense / new Date(currentYear, currentMonth + 1, 0).getDate())}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Transactions This Month</span>
          <span className="stat-value">{stats.monthExpenses.length + stats.monthIncomes.length}</span>
        </div>
      </div>
    </div>
  );
}
