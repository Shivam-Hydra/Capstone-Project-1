"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, Sparkles, Send, ShieldCheck, GraduationCap, Laptop, BookOpen, Route } from "lucide-react";

export function ProductDemo() {
    const [step, setStep] = useState(0);

    // Auto-advance demo steps
    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            user: "I want to become a Senior AI Researcher at a top lab.",
            ai: "Analyzing your goal... mapping skills for AI Research.",
            result: null,
            targetNodes: []
        },
        {
            user: "What skills do I need to focus on first?",
            ai: "Primary focus: Advanced Calculus & PyTorch. Here is your gap analysis:",
            result: "skills",
            targetNodes: ["Calculus", "PyTorch", "Stats", "Paper Writing"]
        },
        {
            user: "Build me a 6-month roadmap.",
            ai: "Generating roadmap... 4 key phases identified.",
            result: "roadmap",
            targetNodes: ["Foundations", "Deep Core", "Thesis"]
        },
        {
            user: "Show me recommended projects.",
            ai: "For AI Research, I recommend these 3 portfolio-building projects.",
            result: "projects",
            targetNodes: ["Diffusion Model", "Paper Review"]
        }
    ];

    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase"
                        >
                            Live Product Demo
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                        >
                            See Your Future <br />
                            <span className="text-blue-500 italic">In Action.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-lg text-slate-400 max-w-lg font-medium"
                        >
                            Experience the power of CareerAI. From natural language goals to exhaustive step-by-step roadmaps, we handle the complexity so you can focus on the growth.
                        </motion.p>

                        <div className="space-y-4 pt-4">
                            {[
                                { icon: Brain, text: "Natural Language Interaction" },
                                { icon: Route, text: "Real-time Roadmap Generation" },
                                { icon: GraduationCap, text: "Skill-Gap Identification" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 text-slate-300 font-bold"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        className="relative perspective-[1000px]"
                    >
                        {/* Mockup Frame */}
                        <div className="bg-[#1E293B] rounded-[40px] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden aspect-[4/3] relative">
                            {/* Window Header */}
                            <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 justify-between">
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                </div>
                                <div className="text-[10px] text-white/20 font-mono tracking-widest uppercase">CareerAI Virtual Terminal</div>
                            </div>

                            {/* Chat Interface Mockup */}
                            <div className="p-8 space-y-8 h-full overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        {/* User Message */}
                                        <div className="flex justify-end pr-10">
                                            <div className="p-4 bg-blue-600 rounded-[24px] rounded-tr-none text-xs text-white font-bold max-w-[80%] shadow-lg">
                                                {steps[step].user}
                                            </div>
                                        </div>

                                        {/* AI Message */}
                                        <div className="flex justify-start pl-10">
                                            <div className="p-5 bg-white/5 border border-white/10 rounded-[24px] rounded-tl-none text-xs text-slate-300 font-medium max-w-[85%] relative overflow-hidden">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="h-3 w-3 text-blue-500" />
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-blue-400">CareerAI</span>
                                                </div>

                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1 }}
                                                >
                                                    {steps[step].ai}
                                                </motion.p>

                                                {/* Dynamic content inside AI response */}
                                                <div className="mt-4">
                                                    {steps[step].result === "skills" && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {steps[step].targetNodes.map((s, idx) => (
                                                                <motion.div
                                                                    key={s}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.5 + idx * 0.3 }}
                                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white/60 flex items-center gap-2 shadow-inner"
                                                                >
                                                                    <ShieldCheck className="h-3 w-3 text-green-500" /> {s}
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {steps[step].result === "roadmap" && (
                                                        <div className="space-y-2 border-l-2 border-blue-500/20 ml-2 pl-4">
                                                            {steps[step].targetNodes.map((p, i) => (
                                                                <motion.div
                                                                    key={p}
                                                                    initial={{ opacity: 0, x: 10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.5 + i * 0.4 }}
                                                                    className="text-[9px] text-white/40 flex items-center gap-2"
                                                                >
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> {p}
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {steps[step].result === "projects" && (
                                                        <div className="flex gap-2">
                                                            {steps[step].targetNodes.map((node, i) => (
                                                                <motion.div
                                                                    key={node}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 1 + i * 0.5 }}
                                                                    className="h-16 w-full bg-blue-500/10 rounded-xl border border-blue-500/20 flex flex-col items-center justify-center gap-1 group overflow-hidden"
                                                                >
                                                                    {i === 0 ? <Laptop className="h-4 w-4 text-blue-400" /> : <BookOpen className="h-4 w-4 text-indigo-400" />}
                                                                    <span className="text-[8px] font-bold text-blue-400">{node}</span>
                                                                    <motion.div
                                                                        animate={{ x: [-100, 100] }}
                                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full"
                                                                    />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Floating UI Elements for high-tech feel */}
                            <motion.div
                                animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-20 right-10 p-4 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl z-20 shadow-2xl"
                            >
                                <div className="text-[10px] font-black text-blue-400">89% MATCH</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
