"use client";

import { useEffect, useState, useRef } from "react";
import { Career } from "@/types";
import { useUserStore } from "@/lib/store";
import { CareerCard } from "@/components/cards/CareerCard";
import { Button } from "@/components/ui/button";
import { CAREERS } from "@/lib/mock-data";
import { 
    BrainCircuit, 
    MessageCircle, 
    TrendingUp, 
    Compass, 
    BarChart3, 
    ArrowRight,
    Search,
    ChevronRight,
    Zap
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CareersPage() {
    const { chatCareers, savedCareers, profile, setRecommendedCareers } = useUserStore();
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatCareers.length > 0) {
            setCareers(chatCareers);
            setRecommendedCareers(chatCareers);
            return;
        }

        const fetchCareers = async () => {
            setLoading(true);
            try {
                if (profile) {
                    const token = await auth.currentUser?.getIdToken();
                    if (token) {
                        const res = await fetch("/api/careers", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ userProfile: profile }),
                        });
                        const data = await res.json();
                        if (res.ok && data.careers?.length > 0) {
                            setCareers(data.careers);
                            setRecommendedCareers(data.careers);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch {
                // silent fallback
            }
            setCareers(CAREERS);
            setRecommendedCareers(CAREERS);
            setLoading(false);
        };

        fetchCareers();
    }, [chatCareers, profile]);

    const recommendedCareers = careers.slice(0, 3);
    const otherCareers = careers.slice(3);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#0F172A] text-white">
                {/* 1. AI RECOMMENDED HERO */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center space-y-4 mb-16">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase"
                            >
                                <BrainCircuit className="h-3.5 w-3.5" />
                                AI Recommended For You
                            </motion.div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                                Careers That Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400">Your Skills</span>
                            </h1>
                            <p className="text-slate-300 font-bold max-w-2xl mx-auto">
                                Based on your skills, interests, and profile, we've identified paths where you'll excel.
                            </p>
                        </div>

                        {/* Cards Carousel/Grid */}
                        <div className="flex flex-wrap gap-8 justify-center items-stretch">
                            {recommendedCareers.map((career, idx) => (
                                <motion.div
                                    key={career.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 }}
                                >
                                    <CareerCard 
                                        career={career} 
                                        isSaved={savedCareers.some(c => c.id === career.id)} 
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
                </section>

                {/* 2. CHAT CTA */}
                <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[32px] bg-gradient-to-r from-blue-600/10 to-transparent border border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white">Not satisfied with these recommendations?</h3>
                                <p className="text-slate-300 font-bold">Chat with CareerAI for a deeper analysis of your background.</p>
                            </div>
                            <Link href="/chat">
                                <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-200 shadow-xl shadow-white/5 transition-all">
                                    Start Career Chat
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 3. EXPLORE MORE CAREERS */}
                <section className="py-24 container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <div className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Compass className="h-3 w-3" /> Explore Paths
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter">More Career Fields</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherCareers.map((career) => (
                            <CareerCard 
                                key={career.id} 
                                career={career} 
                                isSaved={savedCareers.some(c => c.id === career.id)} 
                            />
                        ))}
                    </div>
                </section>

                {/* 4. TRENDING CAREERS */}
                <section className="py-24 bg-white/[0.01]">
                    <div className="container mx-auto px-6">
                        <div className="space-y-1 mb-12">
                            <div className="text-orange-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="h-3 w-3" /> Market Trends
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter text-white">Trending Careers in 2026</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "AI Engineer", growth: "+42%", trend: "Up" },
                                { title: "Cybersecurity", growth: "+35%", trend: "Up" },
                                { title: "Data Scientist", growth: "+28%", trend: "Up" },
                                { title: "UX Designer", growth: "+21%", trend: "Up" },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4 group transition-colors hover:bg-white/[0.05]"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                            <Zap className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-black">
                                            {item.growth} <TrendingUp className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-white">{item.title}</h4>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">High Demand</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CAREER INSIGHTS (DATA VIZ) */}
                <section className="py-24 container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="text-indigo-300 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 className="h-3 w-3" /> Career Metrics
                                </div>
                                <h2 className="text-5xl font-black tracking-tighter leading-tight text-white">Grok the Market with <span className="text-indigo-300">Deep Insights</span></h2>
                                <p className="text-slate-300 font-bold text-lg">
                                    We analyze millions of job postings and salary reports to give you the most accurate career forecast.
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { label: "AI & ML Engineering", val: 95, color: "bg-blue-500" },
                                    { label: "Data Science & Analytics", val: 82, color: "bg-indigo-500" },
                                    { label: "Product Management", val: 74, color: "bg-purple-500" },
                                    { label: "Full Stack Development", val: 88, color: "bg-cyan-500" },
                                ].map((bar, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-black uppercase tracking-widest text-slate-300">
                                            <span>{bar.label}</span>
                                            <span>Demand Index: {bar.val}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${bar.val}%` }}
                                                className={`h-full ${bar.color} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative aspect-square rounded-[40px] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/5 flex items-center justify-center p-12 overflow-hidden group">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                           <div className="z-10 text-center space-y-6">
                                <h4 className="text-3xl font-black text-white">Average Salary Growth</h4>
                                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    +12.4%
                                </div>
                                <p className="text-slate-200 font-bold">Average increase in tech-based career salaries in the last 12 months.</p>
                           </div>
                           <motion.div 
                                className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors"
                           />
                        </div>
                    </div>
                </section>

                {/* 6. FINAL CTA */}
                <section className="py-32 container mx-auto px-6">
                    <div className="relative rounded-[48px] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-24 overflow-hidden text-center">
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                Still Unsure About Your <br className="hidden md:block" /> Career Path?
                            </h2>
                            <p className="text-white/80 font-bold text-lg max-w-2xl mx-auto">
                                Talk with CareerAI and receive a personalized career roadmap in under 60 seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/chat">
                                    <Button className="h-16 px-12 rounded-2xl bg-white text-blue-600 font-black hover:bg-slate-100 shadow-2xl transition-all hover:scale-105 active:scale-95">
                                        Start AI Career Chat
                                    </Button>
                                </Link>
                                <Link href="/profile">
                                    <Button className="h-16 px-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black hover:bg-white/20 transition-all">
                                        Build My Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Animated Glow */}
                        <motion.div 
                            className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[120px] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}
