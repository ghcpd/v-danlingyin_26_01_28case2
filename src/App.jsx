import React, { useState } from 'react';
import { FinanceProvider } from './FinanceContext';
import Overview from './pages/Overview';
import ExpenseManagement from './pages/ExpenseManagement';
import BudgetManagement from './pages/BudgetManagement';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'budgets':
        return <BudgetManagement />;
      default:
        return <Overview />;
    }
  };

  return (
    <FinanceProvider>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <span className="brand-icon">💰</span>
              <span className="brand-text">Personal Finance Planner</span>
            </div>
            <div className="nav-links">
              <button 
                className={`nav-link ${activePage === 'overview' ? 'active' : ''}`}
                onClick={() => setActivePage('overview')}
              >
                Overview
              </button>
              <button 
                className={`nav-link ${activePage === 'expenses' ? 'active' : ''}`}
                onClick={() => setActivePage('expenses')}
              >
                Expenses
              </button>
              <button 
                className={`nav-link ${activePage === 'budgets' ? 'active' : ''}`}
                onClick={() => setActivePage('budgets')}
              >
                Budgets
              </button>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </FinanceProvider>
  );
}

export default App;
