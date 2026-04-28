"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function UniversityHubs() {
  const mapRef = useRef<HTMLDivElement>(null);

  const hubs = [
    { name: "Delhi", top: "30%", left: "45%" },
    { name: "Bangalore", top: "75%", left: "40%" },
    { name: "Mumbai", top: "60%", left: "30%" },
    { name: "Pune", top: "65%", left: "33%" },
    { name: "Hyderabad", top: "65%", left: "45%" },
    { name: "Chennai", top: "80%", left: "45%" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hub-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 70%",
          },
        }
      );
    }, mapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Find builders near you.</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-16">
          Active founder communities in top startup hubs.
        </p>

        <div 
          ref={mapRef}
          className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] rounded-3xl glass-card overflow-hidden border border-gray-200 dark:border-white/5 bg-white dark:bg-black"
        >
          {/* Abstract map background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          {/* Nodes */}
          {hubs.map((hub, i) => (
            <div 
              key={i} 
              className="hub-node absolute flex items-center justify-center group cursor-pointer"
              style={{ top: hub.top, left: hub.left }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-gray-400 dark:bg-white opacity-30 animate-ping" />
                <div className="w-3 h-3 rounded-full bg-gray-800 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                
                <div className="absolute top-full mt-2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-bold text-gray-900 dark:text-white z-20 shadow-lg">
                  {hub.name}
                </div>
              </div>
            </div>
          ))}

          {/* Connection Lines (Decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
             <path d="M 45% 30% L 30% 60% L 40% 75%" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" className="text-gray-800 dark:text-white" />
             <path d="M 45% 30% L 45% 65% L 40% 75%" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" className="text-gray-800 dark:text-white" />
          </svg>
        </div>
      </div>
    </section>
  );
}
