import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const fadeVideo = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (!isNaN(duration) && duration > 0) {
        // Fade in over 0.5s at the start
        if (currentTime < 0.5) {
          video.style.opacity = (currentTime / 0.5).toString();
        } 
        // Fade out over 0.5s before the end
        else if (currentTime > duration - 0.5) {
          video.style.opacity = ((duration - currentTime) / 0.5).toString();
        } 
        // Fully visible in between
        else {
          video.style.opacity = '1';
        }
      }

      animationFrameId = requestAnimationFrame(fadeVideo);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(e => console.error("Video play failed:", e));
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    
    // Start playback and animation loop
    video.play().catch(e => console.error("Autoplay prevented:", e));
    fadeVideo();

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          style={{ top: '300px', inset: 'auto 0 0 0', opacity: 0, transition: 'opacity 0.1s linear' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-3xl tracking-tight font-serif text-foreground">
          Aethera<sup>®</sup>
        </div>
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-sm text-foreground transition-colors">Home</Link>
          <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Studio</a>
          <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">About</a>
          <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Journal</a>
          <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Reach Us</a>
          <Link 
            to="/auth" 
            className="ml-4 rounded-full px-6 py-2.5 text-sm bg-foreground text-background hover:scale-[1.03] transition-transform duration-300"
          >
            Begin Journey
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 'calc(8rem - 75px)', paddingBottom: '10rem' }}>
        <h1 className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif leading-[0.95] tracking-[-2.46px] animate-fade-rise text-foreground">
          <span className="text-muted italic">Beyond silence,</span> we build <br className="hidden sm:block" />
          <span className="text-muted italic">the eternal.</span>
        </h1>
        
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-muted animate-fade-rise-delay">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>

        <Link 
          to="/auth" 
          className="rounded-full px-14 py-5 text-base mt-12 bg-foreground text-background hover:scale-[1.03] transition-transform duration-300 animate-fade-rise-delay-2"
        >
          Begin Journey
        </Link>
      </main>
    </div>
  );
};

export default HeroSection;
