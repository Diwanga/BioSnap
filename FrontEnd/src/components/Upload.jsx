import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { getUploadUrl, uploadToS3, recognizeImage } from '../services/apis';
import Navigation from './Navigation';
import './Upload.css';

function Upload() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('Getting upload URL...');

    try {
      const token = auth.user.access_token;
      const extension = selectedFile.name.split('.').pop() || 'jpg';

      const uploadData = await getUploadUrl(token, extension);
      setStatus('Uploading image...');

      await uploadToS3(uploadData.uploadUrl, selectedFile);
      setStatus('Analyzing image with AI...');

      const recognitionResult = await recognizeImage(token, uploadData.imageKey);
      setStatus('');
      setResult(recognitionResult.recognition);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setStatus('');
  };

  const signOutRedirect = () => {
    const clientId = "31bcut7fng7p51fqqpoug8n4bh";
    const logoutUri = "https://dcyfolii23kqd.cloudfront.net";
    const cognitoDomain = "https://eu-north-1tcd9gejny.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <div className="page-wrapper">
      <Navigation 
        userEmail={auth.user?.profile?.email || 'User'} 
        onSignOut={signOutRedirect}
      />

      <div className="container-small">
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back
          </button>
          <h1 className="page-title">Identify Species</h1>
        </div>

        {!result ? (
          <div className="card">
            <div className="upload-section">
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="file-input"
                />
                <div className="file-input-button">
                  📁 Choose Image
                </div>
              </label>

              {preview && (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="action-buttons">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="btn btn-success btn-large"
                >
                  {loading ? '⏳ Processing...' : '🔍 Identify Species'}
                </button>

                {!loading && (
                  <button onClick={handleReset} className="btn btn-secondary">
                    Clear
                  </button>
                )}
              </div>
            )}

            {status && (
              <div className="alert alert-info">
                <span className="loading-spinner">⏳</span> {status}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                ❌ {error}
              </div>
            )}
          </div>
        ) : (
          <div className="card result-card">
            <h2 className="result-title">Recognition Result</h2>

            {preview && (
              <div className="result-image-container">
                <img src={preview} alt="Recognized" className="result-image" />
              </div>
            )}

            <div className="result-details">
              <div className="result-row">
                <span className="result-label">Type:</span>
                <span className={`type-badge type-${result.type}`}>
                  {result.type}
                </span>
              </div>

              <div className="result-row">
                <span className="result-label">Common Name:</span>
                <span className="result-value">{result.commonName}</span>
              </div>

              <div className="result-row">
                <span className="result-label">Scientific Name:</span>
                <span className="result-value scientific">{result.scientificName}</span>
              </div>

              <div className="result-row">
                <span className="result-label">Confidence:</span>
                <span className="result-value">{(result.confidence * 100).toFixed(0)}%</span>
              </div>

              <div className="result-description">
                <span className="result-label">Description:</span>
                <p className="description-text">{result.description}</p>
              </div>
            </div>

            <button onClick={handleReset} className="btn btn-success btn-large">
              Identify Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;