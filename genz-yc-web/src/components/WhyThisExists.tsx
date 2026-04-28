"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartCrack, Users, MapPinOff } from "lucide-react";

export function WhyThisExists() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const solveTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      // Cards stagger
      const cards = gsap.utils.toArray(".reason-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 100, rotationX: -15 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );

      // "We solve that" text reveal with scale and glow
      gsap.fromTo(
        solveTextRef.current,
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: solveTextRef.current,
            start: "top 85%",
          },
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const reasons = [
    {
      icon: <Users className="w-8 h-8 text-gray-800 dark:text-gray-300" />,
      title: "Wrong team chemistry",
      desc: "Great skills, horrible alignment. You need someone who matches your ambition and speed."
    },
    {
      icon: <HeartCrack className="w-8 h-8 text-gray-800 dark:text-gray-300" />,
      title: "No technical co-founder",
      desc: "You have the vision, but lack the code. Don't let a missing CTO kill your unicorn dream."
    },
    {
      icon: <MapPinOff className="w-8 h-8 text-gray-800 dark:text-gray-300" />,
      title: "No serious builders nearby",
      desc: "Your campus is filled with consultants. You need hackers who want to build the future."
    }
  ];

  return (
    <section ref={containerRef} className="py-32 bg-background text-foreground relative transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        <h2 ref={headlineRef} className="text-4xl md:text-6xl font-bold text-center mb-20 tracking-tight">
          Most startups fail <span className="text-gray-400 dark:text-gray-600">before they start.</span>
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-32 perspective-1000">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="reason-card glass-card rounded-3xl p-8 flex flex-col items-start gap-4 transition-transform hover:-translate-y-2"
            >
              <div className="p-4 rounded-full glass bg-black/5 dark:bg-white/5">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-bold">{reason.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <h2 
            ref={solveTextRef}
            className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 dark:from-white dark:to-gray-800 tracking-tighter"
          >
            We solve that.
          </h2>
        </div>

      </div>
    </section>
  );
}
