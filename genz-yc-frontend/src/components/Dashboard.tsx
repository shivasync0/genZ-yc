import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Github, GitMerge } from 'lucide-react';

const mockProfiles = [
  { id: 1, name: 'Alex Rivera', role: 'Full Stack Engineer', score: 92, bio: 'Ex-Stripe. Building highly scalable distributed systems.', github: 'alexr', skills: ['React', 'Rust', 'PostgreSQL'] },
  { id: 2, name: 'Sarah Chen', role: 'AI Researcher', score: 88, bio: 'Working on LLM agents. Looking for a frontend prodigy.', github: 'sarah-ai', skills: ['Python', 'PyTorch', 'FastAPI'] }
];

const Dashboard = () => {
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    // Here we would call the NestJS backend to create a Match record
    console.log(`Action: ${action} on profile ${id}`);
  };

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem' }}>
      
      {/* Sidebar - User Stats */}
      <div className="glass-panel" style={{ height: 'fit-content' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your Profile</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}></div>
          <div>
            <h4 style={{ fontSize: '1.1rem' }}>David K.</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Looking for Backend</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Builder Score</span>
            <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>85/100</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--panel-bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', background: 'var(--secondary-color)' }}></div>
          </div>
        </div>
        
        <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>Recalculate Score</button>
      </div>

      {/* Main Matching Area */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '600px' }}>
        <AnimatePresence>
          {profiles.length > 0 ? (
            <motion.div
              key={profiles[0].id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: profiles[0].id % 2 === 0 ? 300 : -300, opacity: 0, rotate: profiles[0].id % 2 === 0 ? 15 : -15 }}
              transition={{ duration: 0.4 }}
              className="glass-panel"
              style={{ position: 'absolute', width: '100%', maxWidth: '450px', padding: '0', overflow: 'hidden' }}
            >
              <div style={{ height: '150px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))' }}></div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{profiles[0].name}</h2>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{profiles[0].role}</p>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 'bold' }}>
                    {profiles[0].score} Score
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>"{profiles[0].bio}"</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {profiles[0].skills.map(skill => (
                    <span key={skill} style={{ background: 'var(--panel-bg-hover)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#fff' }}>{skill}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                   <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Github size={16}/> {profiles[0].github}</span>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button onClick={() => handleAction(profiles[0].id, 'reject')} className="btn-secondary" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <X size={24} color="#ff4757" />
                  </button>
                  <button onClick={() => handleAction(profiles[0].id, 'accept')} className="btn-primary" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <Check size={24} color="#2ed573" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--panel-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <GitMerge size={32} color="var(--primary-color)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Out of profiles!</h3>
              <p>Check back later for new matches.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Dashboard;
