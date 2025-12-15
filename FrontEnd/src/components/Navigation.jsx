import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ userEmail, onSignOut }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🌿</span>
            <span className="brand-name">BioSnap</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link 
            to="/upload" 
            className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
          >
            Upload
          </Link>
          
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            History
          </Link>
        </div>

        <div className="nav-user">
          <span className="user-email">{userEmail}</span>
          <button onClick={onSignOut} className="btn btn-danger btn-sm">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;