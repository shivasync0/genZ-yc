"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, GitBranch, TrendingUp, Cpu } from "lucide-react";

export function BuilderScore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Counter animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 99,
            duration: 2,
            ease: "power2.out",
            onUpdate: function() {
              setScore(Math.floor(this.targets()[0].val));
            }
          });
        }
      });

      // Cards stagger reveal
      gsap.fromTo(
        ".score-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-background relative transition-colors duration-300">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">The YC Test.</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">We measure what matters: execution, code, and compatibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Main Score Card */}
          <div className="score-card lg:col-span-2 glass-card rounded-3xl p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-900 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-gray-800 dark:text-gray-300" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold mb-2">Builder Score</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-7xl font-black text-foreground tracking-tighter">{score}</span>
              <span className="text-xl text-gray-500 font-bold">/100</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Based on GitHub activity, past projects, and risk profile.</p>
          </div>

          <div className="score-card glass-card bg-white dark:bg-transparent rounded-3xl p-8 border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-gray-300 dark:hover:border-white/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 text-foreground group-hover:text-black dark:group-hover:text-white transition-colors">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-bold">GitHub Proof</p>
              <p className="text-2xl font-bold text-foreground">Verified</p>
            </div>
          </div>

          <div className="score-card glass-card bg-white dark:bg-transparent rounded-3xl p-8 border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-gray-300 dark:hover:border-white/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 text-foreground group-hover:text-black dark:group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-bold">Startup IQ</p>
              <p className="text-2xl font-bold text-foreground">Top 5%</p>
            </div>
          </div>

          <div className="score-card lg:col-span-4 glass-card bg-white dark:bg-transparent rounded-3xl p-6 border border-gray-200 dark:border-white/5 flex items-center justify-between mt-2">
             <div className="flex items-center gap-4">
                <Cpu className="text-gray-800 dark:text-gray-300 w-8 h-8" />
                <div>
                  <p className="font-bold text-foreground">Compatibility Engine</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">We match you based on 50+ data points.</p>
                </div>
             </div>
             <button className="px-6 py-2 rounded-full border border-gray-300 dark:border-white/20 text-foreground text-sm font-bold hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black transition-colors">
                View Algorithm
             </button>
          </div>

        </div>
      </div>
    </section>
  );
}
