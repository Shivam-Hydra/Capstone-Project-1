"use client";

import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MeshGradient } from "./MeshGradient";
import { HeroVisual } from "./HeroVisual";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";

export function HeroSection() {
    const { chatMessages } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        setMounted(true);
    }, []);

    const hasHistory = chatMessages && chatMessages.length > 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    } as any;

    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#0F172A]">
            <MeshGradient />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-left space-y-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md"
                        >
                            <Sparkles className="h-4 w-4 text-blue-400" />
                            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                                v2.0 AI Career Intelligence
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-[0.9]"
                        >
                            Your Career, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-400 animate-gradient-x">
                                Clearly Mapped.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium"
                        >
                            Navigate your future with surgical precision. Our AI engine deconstructs your DNA,
                            identifies invisible skill gaps, and architect’s a personalized roadmap to your ultimate career destination.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-start gap-4"
                        >
                            <Link href="/chat">
                                <motion.div
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    whileHover="hover"
                                    className="relative group"
                                >
                                    {/* Particle Effect Simulation (Glowing Rings/Dust) */}
                                    <motion.div
                                        animate={isHovered ? { scale: [1, 1.5, 1.2], opacity: [0, 0.4, 0] } : {}}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute -inset-4 bg-blue-500/30 rounded-full blur-2xl opacity-0 pointer-events-none"
                                    />

                                    {/* Dust particles inside the ring */}
                                    {isHovered && [1, 2, 3, 4, 5].map(i => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: 0, y: 0, opacity: 0 }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 100,
                                                y: (Math.random() - 0.5) * 100,
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="absolute left-1/2 top-1/2 w-1 h-1 bg-blue-400 rounded-full blur-[1px] z-0"
                                        />
                                    ))}

                                    <Button className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-2xl font-bold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center gap-3 active:scale-95 group-hover:shadow-[0_0_50px_-5px_rgba(37,99,235,0.7)]">
                                        {mounted && hasHistory ? "Continue Career Chat" : "Start Career Chat"}
                                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </Link>

                            <Link href="/profile/create">
                                <Button variant="outline" className="h-16 px-10 text-lg bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-2xl font-bold backdrop-blur-md transition-all shadow-xl">
                                    Build AI Profile
                                </Button>
                            </Link>
                        </motion.div>


                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative hidden lg:block h-full min-h-[500px]"
                    >
                        <HeroVisual isExternalHover={isHovered} />

                        {/* Interactive floating card inside visual for more depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-0 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl z-20 max-w-[240px]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg">AI</div>
                                <div className="text-xs font-bold text-white uppercase tracking-tighter italic">Matching...</div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-blue-500/20 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: ["10%", "92%", "92%"] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                    />
                                </div>
                                <div className="text-[10px] text-white/60 font-medium">Potential: Senior ML Lead</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom transition gradient to the next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0F172A] to-transparent z-10" />
        </section>
    );
}
