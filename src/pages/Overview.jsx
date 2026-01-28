import React, { useState } from 'react';
import { useFinance } from '../FinanceContext';
import './Overview.css';

const Overview = () => {
  const { incomes, expenses, getTotalIncome, getTotalExpense, addIncome } = useFinance();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = getTotalIncome(currentMonth, currentYear);
  const totalExpense = getTotalExpense(currentMonth, currentYear);
  const balance = totalIncome - totalExpense;

  const allTimeIncome = getTotalIncome();
  const allTimeExpense = getTotalExpense();
  const allTimeBalance = allTimeIncome - allTimeExpense;

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (incomeForm.amount && incomeForm.source) {
      addIncome({
        amount: parseFloat(incomeForm.amount),
        source: incomeForm.source,
        date: incomeForm.date
      });
      setIncomeForm({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });
      setShowIncomeForm(false);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get recent transactions
  const recentIncomes = [...incomes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Financial Overview</h1>
        <button className="btn-primary" onClick={() => setShowIncomeForm(!showIncomeForm)}>
          {showIncomeForm ? 'Cancel' : '+ Add Income'}
        </button>
      </div>

      {showIncomeForm && (
        <div className="income-form-card">
          <h3>Add New Income</h3>
          <form onSubmit={handleAddIncome}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Source</label>
              <input
                type="text"
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                placeholder="e.g., Salary, Freelance"
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Income</button>
          </form>
        </div>
      )}

      <div className="summary-section">
        <h2>Current Month: {monthName}</h2>
        <div className="summary-cards">
          <div className="summary-card income-card">
            <div className="card-label">Total Income</div>
            <div className="card-value">${totalIncome.toFixed(2)}</div>
          </div>
          <div className="summary-card expense-card">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">${totalExpense.toFixed(2)}</div>
          </div>
          <div className={`summary-card balance-card ${balance < 0 ? 'negative' : 'positive'}`}>
            <div className="card-label">Remaining Balance</div>
            <div className="card-value">${balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2>All Time</h2>
        <div className="summary-cards">
          <div className="summary-card income-card">
            <div className="card-label">Total Income</div>
            <div className="card-value">${allTimeIncome.toFixed(2)}</div>
          </div>
          <div className="summary-card expense-card">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">${allTimeExpense.toFixed(2)}</div>
          </div>
          <div className={`summary-card balance-card ${allTimeBalance < 0 ? 'negative' : 'positive'}`}>
            <div className="card-label">Net Balance</div>
            <div className="card-value">${allTimeBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <div className="transaction-column">
          <h3>Recent Income</h3>
          <div className="transaction-list">
            {recentIncomes.map(income => (
              <div key={income.id} className="transaction-item income-item">
                <div className="transaction-info">
                  <div className="transaction-source">{income.source}</div>
                  <div className="transaction-date">
                    {new Date(income.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="transaction-amount income-amount">
                  +${income.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="transaction-column">
          <h3>Recent Expenses</h3>
          <div className="transaction-list">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="transaction-item expense-item">
                <div className="transaction-info">
                  <div className="transaction-source">{expense.category}</div>
                  <div className="transaction-date">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="transaction-amount expense-amount">
                  -${expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
