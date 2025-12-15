import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-icon">🌿</div>
        <h1 className="hero-title">BioSnap</h1>
        <p className="hero-subtitle">AI-Powered Plant & Animal Recognition</p>

        <div className="hero-buttons">
          <Link to="/upload" className="btn btn-success btn-large">
            📸 Identify Species
          </Link>
          <Link to="/history" className="btn btn-primary btn-large">
            📜 View History
          </Link>
        </div>
      </div>

      <div className="features-section card">
        <h2 className="section-title">How It Works</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">1</div>
            <h3 className="feature-title">Upload Image</h3>
            <p className="feature-description">
              Take or upload a photo of any plant or animal
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">2</div>
            <h3 className="feature-title">AI Analysis</h3>
            <p className="feature-description">
              Our AI identifies the species instantly
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">3</div>
            <h3 className="feature-title">Learn More</h3>
            <p className="feature-description">
              Get detailed information and save to history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;