"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Megaphone, TerminalSquare, X, Check } from "lucide-react";

type Profile = {
  id: number;
  name: string;
  role: string;
  seeking: string;
  skills: string[];
  vibe: string;
  color: string;
  icon: any;
};

const profiles: Profile[] = [
  {
    id: 1,
    name: "Aryan S.",
    role: "AI Engineer",
    seeking: "Looking for Marketer",
    skills: ["Python", "PyTorch", "NextJS"],
    vibe: "Weekend Hacker, High Ambition",
    color: "from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900",
    icon: <Code className="w-12 h-12 text-foreground/50" />
  },
  {
    id: 2,
    name: "Priya M.",
    role: "Product Designer",
    seeking: "Seeking SaaS Tech Lead",
    skills: ["Figma", "Framer", "React"],
    vibe: "Aesthetic First, Minimalist",
    color: "from-gray-300 to-gray-500 dark:from-gray-700 dark:to-black",
    icon: <TerminalSquare className="w-12 h-12 text-foreground/50" />
  },
  {
    id: 3,
    name: "Kabir D.",
    role: "Growth / CEO",
    seeking: "Seeking CTO / Fullstack",
    skills: ["Sales", "GTM", "Copywriting"],
    vibe: "Hustler, Cold Email God",
    color: "from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black",
    icon: <Megaphone className="w-12 h-12 text-foreground/50" />
  }
];

export function ProductPreview() {
  const [cards, setCards] = useState<Profile[]>(profiles);

  const handleSwipe = (direction: "left" | "right", id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    // Re-add to loop for demo purposes
    const removedCard = cards.find((c) => c.id === id);
    if (removedCard) {
        setTimeout(() => {
            setCards(prev => [removedCard, ...prev]);
        }, 1000);
    }
  };

  return (
    <section className="py-32 bg-background overflow-hidden relative transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-200/50 dark:bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Find your match.</h2>
        <p className="text-gray-500 dark:text-gray-400">Swipe through curated founders. It's that easy.</p>
      </div>

      <div className="relative w-full max-w-sm mx-auto h-[500px] flex items-center justify-center perspective-1000">
        <AnimatePresence>
          {cards.map((profile, index) => {
            // Only show top 2 cards for performance and visual clarity
            if (index > 1) return null;
            
            return (
              <motion.div
                key={profile.id}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ 
                  scale: index === 0 ? 1 : 0.95, 
                  opacity: index === 0 ? 1 : 0.5,
                  y: index === 0 ? 0 : 20,
                  zIndex: cards.length - index
                }}
                exit={{ x: -200, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -100) handleSwipe("left", profile.id);
                  else if (swipe > 100) handleSwipe("right", profile.id);
                }}
                className={`absolute w-full h-full rounded-3xl p-6 flex flex-col justify-between glass-card overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border-t border-gray-200 dark:border-white/20 bg-white dark:bg-transparent`}
              >
                {/* Gradient Header */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${profile.color} opacity-40 z-0`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{profile.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">{profile.role}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center backdrop-blur-md">
                        {profile.icon}
                    </div>
                  </div>

                  <div className="glass p-3 rounded-xl mb-4">
                    <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">🎯 {profile.seeking}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Vibe Check</p>
                        <p className="text-sm text-gray-900 dark:text-white">{profile.vibe}</p>
                    </div>

                    <div className="flex justify-center gap-6 mt-4">
                        <button 
                            onClick={() => handleSwipe("left", profile.id)}
                            className="w-16 h-16 rounded-full glass flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <button 
                            onClick={() => handleSwipe("right", profile.id)}
                            className="w-16 h-16 rounded-full glass flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            <Check className="w-8 h-8" />
                        </button>
                    </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
