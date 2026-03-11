"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BrainCircuit, Layers, Compass, Zap, CheckCircle2, ChevronRight, Search, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        id: "analysis",
        title: "AI Analysis",
        icon: BrainCircuit,
        color: "blue",
        description: "Experience deep neural analysis of your potential.",
        details: "Our AI doesn't just look at keywords. It maps your cognitive traits to 15,000+ career archetypes.",
        preview: (active: boolean) => (
            <div className="flex flex-col gap-2 w-full pt-4">
                {[70, 95, 80].map((w, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                            <span>{["Research", "Cognition", "Logic"][i]}</span>
                            <span>{active ? w : 10}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: active ? `${w}%` : "10%" }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.2 }}
                                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    },
    {
        id: "input",
        title: "Dual Input System",
        icon: Layers,
        color: "indigo",
        description: "Natural language meets structured data.",
        details: "Type freely like a human, or use our modular profile builder for maximum precision.",
        preview: (active: boolean) => (
            <div className="w-full pt-4 space-y-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/80 font-mono italic">
                    <motion.span
                        animate={active ? { opacity: [0, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        {active ? "I like physics and AI..." : "|"}
                    </motion.span>
                </div>
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-2"
                        >
                            <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-lg text-[10px] text-blue-400 font-bold">Research</div>
                            <div className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-[10px] text-indigo-400 font-bold">Engineering</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    },
    {
        id: "roadmaps",
        title: "Dynamic Roadmaps",
        icon: Compass,
        color: "violet",
        description: "Step-by-step actionable career blueprints.",
        details: "Every roadmap is unique, generated in real-time based on your specific starting point.",
        preview: (active: boolean) => (
            <div className="w-full pt-4 space-y-4">
                {[1, 2, 3].map((step, i) => (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: active ? 1 : 0.2, x: active ? 0 : -10 }}
                        transition={{ delay: i * 0.4 }}
                        className="flex items-center gap-3"
                    >
                        <div className="h-5 w-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[10px] text-violet-400 font-bold">
                            {step}
                        </div>
                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: active ? "100%" : "0%" }}
                                transition={{ duration: 1, delay: i * 0.4 }}
                                className="h-full bg-violet-500"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        )
    },
    {
        id: "insights",
        title: "Instant Insights",
        icon: Zap,
        color: "cyan",
        description: "Identify skill gaps before they stop you.",
        details: "Immediate notification of missing prerequisites with curated course links.",
        preview: (active: boolean) => (
            <div className="w-full pt-4">
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-start gap-3 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                        >
                            <div className="h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px]">⚡</div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">Skill Gap Found</div>
                                <div className="text-[9px] text-white/60 leading-none">Need: Python + Statistics</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }
];

export function InteractiveFeatures() {
    const [activeId, setActiveId] = useState<string | null>("analysis");

    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase"
                    >
                        Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                    >
                        Intelligence Meets <br />
                        <span className="text-blue-500 italic">Intuition.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => {
                        const isActive = activeId === feature.id;

                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onMouseEnter={() => setActiveId(feature.id)}
                                onMouseLeave={() => setActiveId(null)}
                                className={cn(
                                    "p-8 rounded-[32px] border border-white/5 bg-white/5 backdrop-blur-3xl transition-all duration-500 cursor-pointer group relative overflow-hidden h-[420px] flex flex-col justify-between",
                                    isActive && "border-blue-500/30 bg-white/[0.08] shadow-[0_0_50px_rgba(37,99,235,0.1)] -translate-y-2"
                                )}
                            >
                                {/* Active Glow */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none"
                                        />
                                    )}
                                </AnimatePresence>

                                <div>
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 scale-100 group-hover:scale-110",
                                        isActive ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]" : "bg-white/5 text-slate-400 border border-white/5"
                                    )}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>

                                    <h3 className="text-2xl font-black text-white tracking-tighter mb-4 group-hover:text-blue-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4">
                                        {feature.description}
                                    </p>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[11px] text-slate-500 leading-tight"
                                            >
                                                {feature.details}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-8 flex-1 flex items-center justify-center">
                                    {feature.preview(isActive)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Dual Input Live Demo Block (Contextual Callout) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 p-8 rounded-[40px] border border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent backdrop-blur-3xl flex flex-col md:flex-row items-center gap-12 group hover:border-blue-500/40 transition-all duration-500 overflow-hidden relative"
                >
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Search className="h-4 w-4" /></div>
                            <div className="text-xl font-bold text-white tracking-tight">Try the Dual Input</div>
                        </div>
                        <p className="text-slate-400 max-w-md font-medium">
                            Our system bridges the gap between chaos and structure. Speak your mind, we'll build your future.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60">Skills: Physics, Python</div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60">Interests: AI, Space</div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-sm">
                        <div className="p-10 rounded-[32px] bg-[#0F172A] border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
                                <div className="h-3 w-24 bg-slate-800 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-3 w-full bg-slate-900 rounded-full" />
                                <div className="h-3 w-4/5 bg-slate-900 rounded-full" />
                                <motion.div
                                    animate={{
                                        width: ["0%", "100%"],
                                        opacity: [0, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                            {/* Decorative particles */}
                            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
