import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const oauthError = search.get('oauth') === 'error';
    const oauthMessage = search.get('message');
    if (oauthError && oauthMessage) {
      setError(oauthMessage);
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = isRegisterMode
        ? { email, password, username: username.trim() || undefined }
        : { email, password };

      const response = await fetch(`${apiBaseUrl}/auth/${isRegisterMode ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Authentication failed.');
      }

      setMessage(data?.message || 'Success.');
      if (isRegisterMode) {
        setIsRegisterMode(false);
        setPassword('');
      } else {
        if (data?.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('genzyc_auth_token', data.token);
        }
        navigate('/quiz');
      }
    } catch (authError) {
      const authMessage = authError instanceof Error ? authError.message : 'Authentication failed.';
      setError(authMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'linkedin') => {
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-logo">GenZYC.</div>
      
      <div className="auth-top-right">
        {isRegisterMode ? 'Already have an account?' : 'New to GenZYC?'}{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsRegisterMode(!isRegisterMode);
            setMessage('');
            setError('');
          }}
        >
          {isRegisterMode ? 'Sign in' : 'Create account'}
        </a>
      </div>

      {/* Left Side: Cinematic Network */}
      <div className="auth-left">
        {/* Network SVG Background */}
        <div className="auth-bg-canvas">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="heavy-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <g stroke="rgba(165, 127, 255, 0.15)" strokeWidth="1.5">
              <line x1="10%" y1="20%" x2="30%" y2="50%" />
              <line x1="30%" y1="50%" x2="55%" y2="55%" />
              <line x1="55%" y1="55%" x2="65%" y2="25%" />
              <line x1="55%" y1="55%" x2="60%" y2="40%" />
              <line x1="55%" y1="55%" x2="45%" y2="65%" />
              <line x1="45%" y1="65%" x2="25%" y2="78%" />
              <line x1="45%" y1="65%" x2="40%" y2="85%" />
              <line x1="55%" y1="55%" x2="75%" y2="70%" />
              <line x1="30%" y1="50%" x2="20%" y2="60%" />
              <line x1="30%" y1="50%" x2="45%" y2="35%" />
            </g>

            {/* Glowing Nodes */}
            <circle cx="10%" cy="20%" r="3" fill="#a57fff" filter="url(#glow)" />
            <circle cx="30%" cy="50%" r="5" fill="#c8b0ff" filter="url(#glow)" />
            <circle cx="65%" cy="25%" r="4" fill="#a57fff" filter="url(#glow)" />
            <circle cx="60%" cy="40%" r="4.5" fill="#e8d5ff" filter="url(#glow)" />
            <circle cx="45%" cy="65%" r="4" fill="#a57fff" filter="url(#glow)" />
            <circle cx="25%" cy="78%" r="6" fill="#e8d5ff" filter="url(#glow)" />
            <circle cx="40%" cy="85%" r="3" fill="#c8b0ff" filter="url(#glow)" />
            <circle cx="75%" cy="70%" r="4" fill="#a57fff" filter="url(#glow)" />
            <circle cx="20%" cy="60%" r="5" fill="#c8b0ff" filter="url(#glow)" />
            <circle cx="45%" cy="35%" r="3" fill="#e8d5ff" filter="url(#glow)" />

            {/* Central "You" Node */}
            <circle cx="55%" cy="55%" r="8" fill="#fff" filter="url(#heavy-glow)" />
            <circle cx="55%" cy="55%" r="16" fill="none" stroke="rgba(165, 127, 255, 0.4)" strokeWidth="1" />
            <circle cx="55%" cy="55%" r="32" fill="none" stroke="rgba(165, 127, 255, 0.2)" strokeWidth="1" />
            <circle cx="55%" cy="55%" r="55" fill="none" stroke="rgba(165, 127, 255, 0.05)" strokeWidth="1" />
          </svg>
          
          {/* Node Labels */}
          <div style={{ position: 'absolute', top: '55%', left: '55%', transform: 'translate(20px, -10px)', fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>You</div>
          <div style={{ position: 'absolute', top: '25%', left: '65%', transform: 'translate(15px, -5px)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Designer</div>
          <div style={{ position: 'absolute', top: '40%', left: '60%', transform: 'translate(15px, -5px)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Developer</div>
          <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(15px, -15px)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Product</div>
          <div style={{ position: 'absolute', top: '65%', left: '45%', transform: 'translate(-10px, 15px)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Marketer</div>
          <div style={{ position: 'absolute', top: '78%', left: '25%', transform: 'translate(15px, 5px)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Founder</div>
        </div>

        <div className="auth-left-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="auth-badge">
              <div className="auth-badge-dot"></div>
              WELCOME BACK
            </div>
            
            <h1 className="auth-headline">
              Enter the <span>network</span>.<br/>
              Build what matters.
            </h1>
            
            <p className="auth-subtext">
              Sign in to continue connecting with<br/>
              future cofounders.
            </p>
          </motion.div>
        </div>

        <div className="auth-footer">
          <ShieldCheck /> Your data is encrypted and secure.
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className="auth-right">
        <motion.div 
          className="glass-login-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="auth-icon-circle">
            <Lock size={20} />
          </div>

          <h2 className="auth-card-title">{isRegisterMode ? 'Create account' : 'Welcome back'}</h2>
          <p className="auth-card-subtitle">{isRegisterMode ? 'Start your first sprint' : 'Log in to your account'}</p>

          <form onSubmit={handleAuthSubmit}>
            {isRegisterMode && (
              <div className="auth-input-group">
                <label className="auth-label">Username (optional)</label>
                <div className="auth-input-wrap">
                  <Mail />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="founder_handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <Mail />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <EyeOff className="auth-eye" onClick={() => setShowPassword(false)} />
                ) : (
                  <Eye className="auth-eye" onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            {!isRegisterMode && (
            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>
            )}

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : isRegisterMode ? 'Create account' : 'Log in'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider">or continue with</div>

          <div className="auth-social">
            {/* Google */}
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin('google')}>
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            {/* GitHub */}
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin('github')}>
              <svg viewBox="0 0 24 24" fill="#fff">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </button>
            {/* LinkedIn */}
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin('linkedin')}>
              <svg viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

