"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "CareerAI turned my vague interest in 'physics' into a concrete roadmap for Quantum Engineering. I'm now interning at a top lab.",
        author: "Aditi Sharma",
        role: "Physics Student, IIT B",
        avatar: "AS"
    },
    {
        quote: "The skill gap analysis is frighteningly accurate. It found exactly what I was missing for a Senior ML role.",
        author: "Rahul Verma",
        role: "Software Engineer",
        avatar: "RV"
    },
    {
        quote: "Moving from Finance to Data Science felt impossible until I saw the pivot blueprint. It leveraged my existing math skills perfectly.",
        author: "Sarah Chen",
        role: "Data Analyst",
        avatar: "SC"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Success Stories</div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Don't Just Take <br />
                        <span className="text-blue-500 italic">Our Word For It.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-10 rounded-[40px] bg-white/5 border border-white/10 relative group hover:bg-white/[0.08] transition-all duration-500"
                        >
                            <Quote className="h-10 w-10 text-blue-500/20 absolute top-8 right-8 group-hover:text-blue-500/40 transition-colors" />

                            <p className="text-lg text-white font-medium italic leading-relaxed mb-8 relative z-10">
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-white">{t.author}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
