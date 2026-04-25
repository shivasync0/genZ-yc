import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const slidesData = [
  {
    headline: "Your Billion Dollar Idea Is Waiting...",
    subtext: "But your cofounder isn't in your contacts."
  },
  {
    headline: "Builders Are Everywhere.",
    subtext: "Most never meet the right team."
  },
  {
    headline: "Coders. Designers. Marketers. Dreamers.",
    subtext: "Matched by ambition, skill & startup mindset."
  },
  {
    headline: "Not Dating. Not Job Hunting.",
    subtext: "This is Founder Chemistry."
  },
  {
    headline: "What If Your Next Swipe Built The Next Unicorn?",
    subtext: "AI-powered cofounder matching starts here."
  },
  {
    headline: "Welcome to GenZ YC",
    subtext: "Find your people. Build the future."
  }
];

const Slide = ({ index, data, scrollYProgress }: { index: number, data: any, scrollYProgress: any }) => {
  // Each slide occupies 1/6th of the total scroll space.
  // We want it to fade in, stay for a bit, then fade out.
  const step = 1 / 6;
  const startFadeIn = index * step;
  const fullOpacity = startFadeIn + (step * 0.2);
  const startFadeOut = startFadeIn + (step * 0.8);
  const fullyHidden = (index + 1) * step;

  // The last slide stays visible
  const isLast = index === slidesData.length - 1;

  const opacity = useTransform(
    scrollYProgress,
    [startFadeIn, fullOpacity, startFadeOut, fullyHidden],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [startFadeIn, fullOpacity, startFadeOut, fullyHidden],
    isLast ? [50, 0, 0, 0] : [50, 0, -50, -100]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [startFadeIn, fullOpacity, startFadeOut, fullyHidden],
    isLast ? [0.95, 1, 1, 1] : [0.95, 1, 1.05, 1.1]
  );

  const navigate = useNavigate();

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        y,
        scale,
        textAlign: 'center',
        padding: '0 2rem'
      }}
    >
      <h1 className="text-glow" style={{ fontSize: '5vw', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, maxWidth: '1200px' }}>
        {data.headline}
      </h1>
      <p style={{ fontSize: '1.8vw', color: 'var(--text-muted)', fontWeight: 400, maxWidth: '800px' }}>
        {data.subtext}
      </p>

      {isLast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem' }}
        >
          <button onClick={() => navigate('/auth')} className="btn-secondary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
            Join Waitlist
          </button>
          <button onClick={() => navigate('/auth')} className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
            Find Cofounder
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export const IntroSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
      {/* Sticky container that stays on screen while scrolling through the 600vh height */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        
        {/* Subtle particle background effect */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', mixBlendMode: 'overlay', pointerEvents: 'none' }}></div>

        {slidesData.map((slide, index) => (
          <Slide key={index} index={index} data={slide} scrollYProgress={scrollYProgress} />
        ))}
        
      </div>
    </div>
  );
};
