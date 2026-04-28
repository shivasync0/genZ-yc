"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserPlus, BrainCircuit, Zap } from "lucide-react";

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Connect line animation
      gsap.fromTo(
        lineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      );

      // Steps reveal
      const steps = gsap.utils.toArray(".step-item");
      steps.forEach((step: any, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Create Founder Profile",
      desc: "Skills, interests, startup dream, and your weekly commitment. Be honest.",
      icon: <UserPlus className="w-6 h-6 text-foreground" />,
      align: "left"
    },
    {
      num: "02",
      title: "Take Vibe-Check Quiz",
      desc: "Risk tolerance, ambition, build style, and values. We map your founder DNA.",
      icon: <BrainCircuit className="w-6 h-6 text-foreground" />,
      align: "right"
    },
    {
      num: "03",
      title: "Get Matched Instantly",
      desc: "Chat, connect, and start building. Stop searching, start executing.",
      icon: <Zap className="w-6 h-6 text-foreground" />,
      align: "left"
    }
  ];

  return (
    <section ref={containerRef} className="py-32 bg-gray-50 dark:bg-[#050505] text-foreground relative transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            A frictionless path from solo to co-founder.
          </p>
        </div>

        <div ref={stepsRef} className="relative flex flex-col gap-24">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-white/10 -translate-x-1/2 hidden md:block">
            <div ref={lineRef} className="w-full bg-gradient-to-b from-gray-400 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-gray-600" />
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className={`step-item flex flex-col md:flex-row items-center gap-8 md:gap-16 ${step.align === "right" ? "md:flex-row-reverse" : ""}`}>
              
              <div className={`flex-1 flex ${step.align === "right" ? "justify-start" : "justify-end"} w-full md:w-auto`}>
                <div className="glass-card p-8 rounded-3xl w-full md:w-[400px] border border-gray-200 dark:border-white/5 relative group bg-white dark:bg-transparent">
                  <div className="relative">
                    <span className="text-5xl font-black text-gray-200 dark:text-white/5 mb-4 block">{step.num}</span>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                  </div>
                </div>
              </div>

              {/* Center node */}
              <div className="hidden md:flex w-16 h-16 rounded-full glass items-center justify-center relative z-10 border border-gray-300 dark:border-white/10 bg-white dark:bg-black shadow-md">
                {step.icon}
              </div>

              <div className="flex-1" />

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
