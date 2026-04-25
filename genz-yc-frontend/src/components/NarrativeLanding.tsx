import { motion } from 'framer-motion';
import { Target, MapPin, Sparkles, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IntroSequence } from './IntroSequence';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const NarrativeLanding = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/12a9780eeb1ea015801a5f55cf2e9d3d/manifest/video.m3u8';

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("HLS play failed:", e));
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Native play failed:", e));
      });
    }
  }, []);

  return (
    <div style={{ background: 'transparent', position: 'relative' }}>
      
      {/* Fixed Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.4
        }}
      />

      {/* 6-Slide Cinematic Intro */}
      <IntroSequence />

      {/* Rest of the Landing Page sections smoothly reveal below */}
      <div style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>
        
        {/* Features / The Match Engine */}
        <section className="narrative-section">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', margin: '0 auto' }}
          >
            <div>
              <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                <Target size={24} color="var(--primary-color)" />
              </div>
              <h2 className="text-glow" style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                The Match Engine
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Think of it as Tinder for Founders. Our algorithm pairs you based on <strong>complementary skills</strong>, not identical resumes. 
                <br /><br />
                Swipe on vetted engineers, marketers, and designers. Connect instantly.
              </p>
            </div>
            
            <div className="glass-panel" style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', width: '80%' }}
              >
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-color)' }}></div>
                   <div>
                     <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Sarah J.</h4>
                     <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>GTM & Growth Expert</span>
                   </div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                   "Looking for a technical architect to build out a fintech MVP. I have 10k waitlist subscribers."
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* University Nodes & Demo Day */}
        <section className="narrative-section">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}
          >
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <MapPin size={32} color="var(--primary-color)" />
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>University Nodes</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                Join hubs like the <strong>Chandigarh University Node</strong> to find exceptional mates within your physical proximity.
              </p>
            </div>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Sparkles size={32} color="var(--primary-color)" />
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Demo Day</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                Launch your MVP to a curated list of elite mentors and campus investors right on the platform.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Compatibility Quiz / Founder Test */}
        <section className="narrative-section" style={{ borderTop: '1px solid var(--border-color)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ maxWidth: '800px', textAlign: 'center', margin: '0 auto' }}
          >
            <ClipboardList size={40} color="var(--primary-color)" style={{ marginBottom: '2rem' }} />
            <h2 className="text-glow" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-main)' }}>
              Compatibility Quiz
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
              Pass our YC-style vetting protocol to enter the pool.
            </p>
            
            <div style={{ textAlign: 'left', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', padding: '3rem', borderRadius: '24px', marginBottom: '4rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '1rem' }}><span style={{ color: 'var(--text-main)' }}>01.</span> What problem would you work on for 5 years?</li>
                <li style={{ display: 'flex', gap: '1rem' }}><span style={{ color: 'var(--text-main)' }}>02.</span> Why are you the right person?</li>
                <li style={{ display: 'flex', gap: '1rem' }}><span style={{ color: 'var(--text-main)' }}>03.</span> What is your unfair advantage?</li>
              </ul>
            </div>

            <button onClick={() => navigate('/auth')} className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
              Take the Test & Register
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default NarrativeLanding;
