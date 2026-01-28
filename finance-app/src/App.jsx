import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Navigation from './components/Navigation';
import Overview from './pages/Overview';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'expenses':
        return <Expenses />;
      case 'budget':
        return <Budget />;
      default:
        return <Overview />;
    }
  };

  return (
    <FinanceProvider>
      <div className="app">
        <Navigation activePage={activePage} onNavigate={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </FinanceProvider>
  );
}

export default App;
