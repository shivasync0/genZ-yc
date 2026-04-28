"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      )
        .fromTo(
          subheadRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );

      // Particle / floating cards animation
      gsap.to(".floating-card", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-5, 5)",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });
      
      // Moving network lines
      gsap.to(".network-line", {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Network Lines Background */}
      <div ref={linesRef} className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <path className="network-line" d="M 100 100 Q 300 200 500 100 T 900 100" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset="1000" />
          <path className="network-line" d="M 0 400 Q 400 300 600 500 T 1200 400" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset="1000" />
        </svg>
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="floating-card absolute hidden md:flex top-32 left-32 glass-card p-4 rounded-2xl z-0 items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800" />
        <div>
          <p className="text-sm font-bold text-foreground">Alex C.</p>
          <p className="text-xs text-gray-500">AI Engineer</p>
        </div>
      </motion.div>

      <motion.div 
        className="floating-card absolute hidden md:flex bottom-40 right-32 glass-card p-4 rounded-2xl z-0 items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-900" />
        <div>
          <p className="text-sm font-bold text-foreground">Sarah T.</p>
          <p className="text-xs text-gray-500">Growth Hacker</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 text-sm mb-8 bg-white/50 dark:bg-black/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-600 dark:bg-gray-400"></span>
          </span>
          Currently Matching YC W25 Batch
        </div>

        <h1 
          ref={headlineRef} 
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
        >
          Find Your Co-Founder <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 dark:from-white dark:via-gray-300 dark:to-gray-500">
            Before Someone Else Does.
          </span>
        </h1>
        
        <p 
          ref={subheadRef}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Match with builders, hackers, hustlers, designers, and future unicorn founders based on skill, ambition, and vibe.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
            <span className="relative z-10">Join Waitlist</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gray-600 dark:bg-gray-300 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
          </button>
          <button className="px-8 py-4 glass text-foreground rounded-full font-bold text-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10">
            Find Matches
          </button>
        </div>
      </div>
    </section>
  );
}
