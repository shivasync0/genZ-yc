"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-transparent flex flex-col items-center justify-center min-h-[80vh]">
      {/* Cloudy / Misty Background Effects for Light Mode are handled globally in globals.css now. 
          But we can add a subtle dark mode mist here so it's not totally empty in dark mode. */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[100%] bg-white dark:bg-white/10 blur-[100px] rounded-full mix-blend-overlay" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-gray-200 dark:bg-black blur-[120px] rounded-full mix-blend-overlay" />
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-tr from-transparent via-gray-100 dark:via-white/5 to-transparent blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        
        {/* Floating Twitter Icon */}
        <motion.a 
          href="#"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-14 h-14 bg-[#111111] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </motion.a>

        {/* Beta Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 backdrop-blur-sm mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">Beta goes live soon</span>
        </motion.div>

        {/* Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] dark:text-white mb-6 max-w-4xl leading-[1.1]"
        >
          Early Access to <br className="hidden md:block" />
          Future of Startup <span className="font-serif italic text-gray-700 dark:text-gray-300 font-medium">Founders</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium"
        >
          Find the perfect co-founder, align your vision, and scale your startup's ambition — all in one place
        </motion.p>

        {/* Input & Button */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative w-full max-w-md mx-auto mb-8 group"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-gray-300 dark:focus-within:border-white/20 focus-within:ring-4 focus-within:ring-gray-100 dark:focus-within:ring-white/5 transition-all">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="flex-1 bg-transparent px-6 py-3 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none w-full"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-[#111111] dark:bg-white text-white dark:text-black rounded-full font-semibold text-sm hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-md whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </div>
        </motion.form>

        {/* Social Proof Avatars */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          <div className="flex -space-x-3">
            <img className="w-8 h-8 rounded-full border-2 border-[#fafafa] dark:border-black shadow-sm object-cover" src="https://i.pravatar.cc/100?img=11" alt="Avatar" />
            <img className="w-8 h-8 rounded-full border-2 border-[#fafafa] dark:border-black shadow-sm object-cover" src="https://i.pravatar.cc/100?img=12" alt="Avatar" />
            <img className="w-8 h-8 rounded-full border-2 border-[#fafafa] dark:border-black shadow-sm object-cover" src="https://i.pravatar.cc/100?img=33" alt="Avatar" />
          </div>
          <span>Join 8,458+ ambitious builders</span>
        </motion.div>

      </div>
    </section>
  );
}
