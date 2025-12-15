import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";
import Upload from './components/Upload.jsx';
import History from './components/History.jsx';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Tcd9GeJNY",
  client_id: "31bcut7fng7p51fqqpoug8n4bh",
   redirect_uri: "https://dcyfolii23kqd.cloudfront.net",
    // redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById('root')).render(
  <AuthProvider {...cognitoAuthConfig}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  </AuthProvider>
)