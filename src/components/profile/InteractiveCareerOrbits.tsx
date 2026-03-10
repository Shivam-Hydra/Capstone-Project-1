"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Career } from "@/types";

interface InteractiveCareerOrbitsProps {
    careers: Career[];
}

export function InteractiveCareerOrbits({ careers }: InteractiveCareerOrbitsProps) {
    // Start at a high number to avoid negative modulo issues
    const [offset, setOffset] = useState(10000); 

    useEffect(() => {
        if (!careers || careers.length <= 1) return;

        // Continuously scroll the carousel downwards every 3.5 seconds
        const interval = setInterval(() => {
            setOffset(prev => prev - 1);
        }, 3500);

        return () => clearInterval(interval);
    }, [careers]);

    if (!careers || careers.length === 0) return null;

    // Grab exactly contiguous 3 items based on offset
    const visibleItems = [0, 1, 2].map((i) => {
        const virtualIndex = offset + i;
        const actualIndex = virtualIndex % careers.length;
        const career = careers[actualIndex];
        return {
            career,
            uniqueKey: `carousel-item-${virtualIndex}`,
            visualIndex: i
        };
    });

    return (
        <div className="absolute right-[-240px] top-24 hidden 2xl:flex flex-col w-32 z-10 perspective-[1000px]">
            <AnimatePresence initial={false}>
                {visibleItems.map(({ career, uniqueKey, visualIndex }) => {
                    // Generate subtle colors for fallback and glowing
                    const hue1 = (career.id.charCodeAt(0) * 20) % 360 || (visualIndex * 60);
                    const hue2 = (hue1 + 60) % 360;
                    
                    // Use LoremFlickr for semantic professional image results based on the career title
                    const searchTerms = encodeURIComponent((career.domain || career.title).split(' ')[0].toLowerCase());
                    const imageUrl = `https://loremflickr.com/400/400/${searchTerms}?lock=${career.id.charCodeAt(0) || 1}`;

                    return (
                        <motion.div
                            layout
                            key={uniqueKey}
                            initial={{ 
                                opacity: 0, 
                                y: -60, 
                                scale: 0.6,
                                height: 0, // Animating height enables smooth pushing
                                marginBottom: 0 
                            }}
                            animate={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: 1,
                                height: "128px", // w-32 h-32 = 128px
                                marginBottom: "48px", // gap-12 = 48px
                                filter: "blur(0px)" 
                            }}
                            exit={{ 
                                opacity: 0, 
                                y: 60, 
                                scale: 0.6,
                                height: 0,
                                marginBottom: 0,
                                filter: "blur(5px)" 
                            }}
                            whileHover={{ scale: 1.1, zIndex: 50 }}
                            transition={{
                                layout: { type: "spring", stiffness: 60, damping: 14 },
                                opacity: { duration: 0.4 },
                                y: { type: "spring", stiffness: 60, damping: 14 },
                                height: { type: "spring", stiffness: 60, damping: 14 },
                                marginBottom: { type: "spring", stiffness: 60, damping: 14 },
                                scale: { duration: 0.3 }
                            }}
                            className="relative group cursor-pointer flex justify-center origin-center"
                        >
                            {/* Outer Glow / Orbit Ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20 + visualIndex * 5, ease: "linear" }}
                                className="absolute -inset-2 rounded-full border border-dashed border-blue-500/30 dark:border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            
                            {/* Tooltip */}
                            <div className="absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 text-sm font-bold rounded-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl border border-white/10 dark:border-black/10 z-[100] origin-right">
                                {career.title}
                                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900/90 dark:bg-white/90 rotate-45 border-r border-t border-white/10 dark:border-black/10" />
                            </div>

                            {/* Main Circle Component */}
                            <div 
                                className="w-32 h-32 rounded-full border-[3px] border-white dark:border-slate-800 shadow-2xl overflow-hidden relative shrink-0"
                            >
                                {/* Fallback Gradient Backdrop */}
                                <div 
                                    className="absolute inset-0 flex items-center justify-center text-xl font-black text-white mix-blend-overlay z-0"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 40%))`
                                    }}
                                >
                                    {career.title.substring(0, 2).toUpperCase()}
                                </div>
                                
                                <img 
                                    src={imageUrl} 
                                    alt={career.title}
                                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                                    onError={(e: any) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                    loading="lazy"
                                />

                                {/* Internal Glass Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 z-20 pointer-events-none rounded-full" />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
