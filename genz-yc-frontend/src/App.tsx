import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import GenZYCLanding from './components/GenZYCLanding';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import OAuthCallback from './components/OAuthCallback';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="app-container">
      {(!isAuthPage && !isLandingPage) && (
        <nav className="glass-nav">
          <div className="nav-brand">GenZ YC.</div>
          <div className="nav-links">
            <a href="/">Story</a>
            <a href="/auth">Sign In</a>
            <a href="/dashboard">Match</a>
            <button 
              onClick={toggleTheme} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="/chat" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Chats</a>
          </div>
        </nav>
      )}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<GenZYCLanding />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatInterface />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
