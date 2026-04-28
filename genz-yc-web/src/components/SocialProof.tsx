"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const partners = [
    "Stanford", "MIT", "Y Combinator", "Techstars", "Harvard Build", "Sequoia", "a16z"
  ];

  return (
    <section className="py-24 bg-background overflow-hidden relative border-y border-gray-200 dark:border-white/5 transition-colors duration-300" ref={ref}>
      <div className="container mx-auto px-6 mb-10 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest text-gray-500 uppercase"
        >
          Built for ambitious students and startup builders from
        </motion.p>
      </div>

      <div className="flex relative w-full overflow-hidden">
        <motion.div 
          className="flex space-x-16 items-center whitespace-nowrap min-w-max px-8"
          animate={{ x: [0, -1035] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* We duplicate the logos array to create a seamless loop */}
          {[...partners, ...partners].map((partner, i) => (
            <div key={i} className="text-2xl md:text-3xl font-bold text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
              {partner}
            </div>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-colors duration-300" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-colors duration-300" />
      </div>
    </section>
  );
}
