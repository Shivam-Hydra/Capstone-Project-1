"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GraduationCap, Briefcase, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
    {
        id: "student",
        label: "Student",
        icon: GraduationCap,
        title: "Launch Your Career with Certainty.",
        desc: "Don't guess. Our AI analyzes your academic profile and interests to find the perfect launchpad.",
        features: ["Internship Matching", "Skill Gap Analysis", "Major Selection Support"]
    },
    {
        id: "pro",
        label: "Professional",
        icon: Briefcase,
        title: "Scale Your Impact, Strategically.",
        desc: "High-growth roles require a precise skill set. We map your current XP to senior leadership paths.",
        features: ["Promotion Roadmap", "Industry Trend Analysis", "Senior Role Mapping"]
    },
    {
        id: "switcher",
        label: "Career Switcher",
        icon: RefreshCw,
        title: "Pivoting Made Predictable.",
        desc: "Leverage your transferable skills. We find the shortest path from where you are to where you want to be.",
        features: ["Transferable Skill Mapping", "Pivot Blueprints", "Reskilling Pathways"]
    }
];

export function PersonalizationSection() {
    const [activeRole, setActiveRole] = useState(roles[0]);

    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase"
                        >
                            Tailored For You
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Built For Your <br />
                            <span className="text-blue-500 italic">Unique Path.</span>
                        </h2>
                    </div>

                    {/* Role Selector */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRole(role)}
                                className={cn(
                                    "px-8 py-5 rounded-[24px] border transition-all duration-500 flex items-center gap-3 font-bold text-sm",
                                    activeRole.id === role.id
                                        ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-105"
                                        : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <role.icon className="h-5 w-5" />
                                {role.label}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRole.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="p-12 md:p-16 rounded-[48px] border border-white/10 bg-white/5 backdrop-blur-3xl relative overflow-hidden group"
                        >
                            {/* Decorative Background Icon */}
                            <activeRole.icon className="absolute -bottom-20 -right-20 h-80 w-80 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                                        {activeRole.title}
                                    </h3>
                                    <p className="text-lg text-slate-400 font-medium leading-relaxed">
                                        {activeRole.desc}
                                    </p>
                                    <div className="space-y-4">
                                        {activeRole.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 text-white font-bold text-sm italic">
                                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative hidden md:block">
                                    <div className="aspect-square bg-blue-600/20 rounded-[40px] border border-blue-500/20 flex flex-col items-center justify-center p-8 space-y-6 shadow-2xl">
                                        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                                            <activeRole.icon className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="space-y-3 w-full">
                                            <div className="h-2 w-full bg-blue-500/20 rounded-full" />
                                            <div className="h-2 w-4/5 bg-blue-500/20 rounded-full" />
                                            <motion.div
                                                animate={{ width: ["0%", "100%"] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="h-2 w-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic">Path Optimized</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
