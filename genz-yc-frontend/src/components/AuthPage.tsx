import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth & YC test submission
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--bg-color)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '550px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Apply to GenZ YC'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Enter your credentials to access the incubator.' : 'Complete the Founder Test to join the matching pool.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>Full Name</label>
                <input type="text" className="input-field" placeholder="Steve Jobs" required />
              </motion.div>
            )}

            <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>Email Address</label>
            <input type="email" className="input-field" placeholder="founder@startup.com" required />

            <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" required />

            {!isLogin && (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}
                >
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>The Founder Test</h4>
                  
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>What problem would you work on for 5 years?</label>
                  <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="E.g., Fixing global supply chains..." required></textarea>

                  <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>Why are you the right person?</label>
                  <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="I have 10 years experience in logistics..." required></textarea>

                  <label style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>What is your unfair advantage?</label>
                  <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Proprietary API access to major shipping lines..." required></textarea>
                </motion.div>
              </AnimatePresence>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
              {isLogin ? 'Sign In' : 'Submit Application & Register'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}
          >
            {isLogin ? "Don't have an account? Apply now." : "Already an incubator member? Sign in."}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
