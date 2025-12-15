import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/apis';
import Navigation from './Navigation';
import './History.css';

function History() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = auth.user.access_token;
      const data = await getHistory(token);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const signOutRedirect = () => {
    const clientId = "31bcut7fng7p51fqqpoug8n4bh";
    const logoutUri = "https://dcyfolii23kqd.cloudfront.net";
    const cognitoDomain = "https://eu-north-1tcd9gejny.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navigation 
          userEmail={auth.user?.profile?.email || 'User'} 
          onSignOut={signOutRedirect}
        />
        <div className="container">
          <div className="loading">⏳ Loading your history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Navigation 
          userEmail={auth.user?.profile?.email || 'User'} 
          onSignOut={signOutRedirect}
        />
        <div className="container">
          <div className="card">
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
              <button onClick={fetchHistory} className="btn btn-danger" style={{ marginTop: '15px' }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="page-wrapper">
        <Navigation 
          userEmail={auth.user?.profile?.email || 'User'} 
          onSignOut={signOutRedirect}
        />
        <div className="container">
          <div className="page-header">
            <button onClick={() => navigate('/')} className="back-button">
              ← Back
            </button>
            <h1 className="page-title">Recognition History</h1>
          </div>
          <div className="card empty-state">
            <div className="empty-icon">📭</div>
            <h2 className="empty-title">No recognitions yet</h2>
            <p className="empty-text">Upload an image to get started!</p>
            <button onClick={() => navigate('/upload')} className="btn btn-success btn-large">
              📸 Identify Species
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navigation 
        userEmail={auth.user?.profile?.email || 'User'} 
        onSignOut={signOutRedirect}
      />

      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back
          </button>
          <h1 className="page-title">Recognition History</h1>
          <button onClick={fetchHistory} className="refresh-button">
            🔄 Refresh
          </button>
        </div>

        <p className="history-count">
          Total recognitions: <strong>{history.length}</strong>
        </p>

        <div className="history-grid">
          {history.map((item) => (
            <HistoryCard key={item.recognitionId} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item }) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-card">
      <div className="card-image-container">
        {!imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.commonName}
            onError={() => setImageError(true)}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder">
            <span>📷</span>
            <p>Image not available</p>
          </div>
        )}
      </div>

      <div className="card-content">
        <span className={`type-badge type-${item.type}`}>
          {item.type}
        </span>

        <h3 className="card-title">{item.commonName}</h3>
        <p className="card-scientific">{item.scientificName}</p>
        <p className="card-description">{item.description}</p>

        <div className="card-footer">
          <span className="card-confidence">
            <strong>Confidence:</strong> {(item.confidence * 100).toFixed(0)}%
          </span>
          <span className="card-date">{formatDate(item.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

export default History;