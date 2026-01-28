import './Navigation.css';

export default function Navigation({ activePage, onNavigate }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💳' },
    { id: 'budget', label: 'Budget', icon: '🎯' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-icon">💰</span>
        <span className="brand-text">FinanceTracker</span>
      </div>
      
      <ul className="nav-menu">
        {navItems.map(item => (
          <li key={item.id}>
            <button
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <span className="user-name">John Doe</span>
            <span className="user-email">john@example.com</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
