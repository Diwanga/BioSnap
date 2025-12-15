import { useAuth } from "react-oidc-context";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home.jsx';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('code') || urlParams.has('state')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [auth.isAuthenticated]);

  const signOutRedirect = () => {
      localStorage.clear();
  sessionStorage.clear();
    const clientId = "31bcut7fng7p51fqqpoug8n4bh";
    const logoutUri = "https://dcyfolii23kqd.cloudfront.net";
    //  const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://eu-north-1tcd9gejny.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="error-screen">
        <div className="error-card card">
          <h2>Authentication Error</h2>
          <p>{auth.error.message}</p>
          <button 
            onClick={() => auth.signinRedirect()}
            className="btn btn-primary btn-large"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="app-wrapper">
        <Navigation 
          userEmail={auth.user?.profile?.email || 'User'} 
          onSignOut={signOutRedirect}
        />
        <Home />
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">🌿</div>
        <h1 className="login-title">BioSnap</h1>
        <p className="login-subtitle">AI-Powered Species Recognition</p>
        <button 
          onClick={() => auth.signinRedirect()}
          className="btn btn-primary btn-large btn-block"
        >
          Sign In to Get Started
        </button>
      </div>
    </div>
  );
}

export default App;