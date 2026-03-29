"use client";

import { CurvedRoadmap } from "@/components/explore/CurvedRoadmap";
import { 
    MessageCircle, 
    RefreshCcw, 
    Target, 
    Clock, 
    Sparkles, 
    ArrowRight, 
    TrendingUp, 
    Zap, 
    BrainCircuit, 
    Search, 
    Cpu, 
    CheckCircle2, 
    Circle,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CTASection } from "@/components/home/CTASection";
import { MainFooter } from "@/components/home/MainFooter";
import { cn } from "@/lib/utils";

// Sub-component for Floating AI Nodes animation
function FloatingAINodes() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-blue-500/30 blur-2xl"
                    animate={{
                        x: [
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%"
                        ],
                        y: [
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%"
                        ],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: 200 + Math.random() * 300 + "px",
                        height: 200 + Math.random() * 300 + "px",
                        left: "-10%",
                        top: "-10%",
                    }}
                />
            ))}
        </div>
    );
}

export default function ExplorePage() {
    const { profile, chatCareers, chatCourses } = useUserStore();

    const hasRecommendations = chatCareers.length > 0 || chatCourses.length > 0;

    // Derived context and mock alternatives if needed
    const primaryCareer = chatCareers[0]?.title || "AI Engineer / Machine Learning Engineer";
    const timeline = "12 – 18 months";
    const recommendedSkills = chatCourses.slice(0, 3).map(c => c.tags[0] || "Python").join(" • ");
    
    // Progress tracker data
    const progressSteps = [
        { label: "Step 1", status: "Complete", title: "Assessment" },
        { label: "Step 2", status: "Current", title: "Course Selection" },
        { label: "Step 3", status: "Upcoming", title: "Certification" }
    ];

    return (
        <ProtectedRoute>
            <div className="dark min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
                {/* 1. HERO SECTION */}
                <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                    <FloatingAINodes />
                    
                    <div className="container mx-auto relative z-10 text-center space-y-8 max-w-4xl pt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
                        >
                            <BrainCircuit className="h-4 w-4 text-blue-400" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">AI GENERATED ROADMAP</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter leading-tight !text-white force-text-contrast"
                        >
                            Your Personalized <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 drop-shadow-sm">
                                Career Journey
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            Based on your chat, CareerAI has generated a step-by-step path connecting courses and career milestones.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        >
                            <Link href="/chat">
                                <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-black hover:bg-blue-50 transition-all flex items-center gap-2 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                                    <MessageCircle className="h-5 w-5" />
                                    Continue Career Chat
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white font-black hover:bg-white/10 transition-all flex items-center gap-2">
                                <RefreshCcw className="h-5 w-5" />
                                Regenerate Roadmap
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* 2. ROADMAP CONTEXT STRIP */}
                {hasRecommendations && (
                    <section className="container mx-auto px-4 pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                { label: "Career Goal", value: primaryCareer, icon: Target, color: "text-blue-400" },
                                { label: "Estimated Timeline", value: timeline, icon: Clock, color: "text-indigo-400" },
                                { label: "Recommended Skills", value: recommendedSkills, icon: Zap, color: "text-amber-400" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-12 w-12 text-white" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                                    <h4 className="text-lg font-bold !text-white leading-tight">{item.value}</h4>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 11. ADD PROGRESS TRACKER */}
                {hasRecommendations && (
                    <section className="container mx-auto px-4 pb-12">
                        <div className="max-w-4xl mx-auto py-12 border-t border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic !text-white force-text-contrast">Your Progress</h2>
                                <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">33% Completed</span>
                            </div>
                            
                            <div className="relative pt-8">
                                {/* Track Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "33%" }}
                                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                    />
                                </div>

                                <div className="relative flex justify-between">
                                    {progressSteps.map((step, i) => (
                                        <div key={i} className="flex flex-col items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center z-10 border-4",
                                                step.status === "Complete" ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]" :
                                                step.status === "Current" ? "bg-slate-900 border-blue-400 text-blue-400 animate-pulse" :
                                                "bg-slate-900 border-white/10 text-slate-500"
                                            )}>
                                                {step.status === "Complete" ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.label}</p>
                                                <p className={cn("text-xs font-bold", step.status === "Current" ? "!text-white" : "text-slate-300")}>{step.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. ROADMAP SECTION */}
                <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
                    {hasRecommendations ? (
                        <CurvedRoadmap careers={chatCareers} courses={chatCourses} />
                    ) : (
                        <div className="container mx-auto px-4 py-20 text-center">
                            <div className="max-w-md mx-auto space-y-8">
                                <div className="h-20 w-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                                    <Search className="h-10 w-10 text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic !text-white">No Roadmap Found</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Chat with our AI to generate a highly personalized roadmap of careers and courses tailored just for you.
                                </p>
                                <Link href="/chat" className="inline-block pt-4">
                                    <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-black hover:bg-blue-50 transition-all flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Start AI Chat Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                {/* 9. ALTERNATIVE PATHS SECTION */}
                {hasRecommendations && (
                    <section className="py-32 container mx-auto px-4 border-t border-white/5">
                        <div className="text-center space-y-4 mb-20">
                            <h2 className="text-5xl font-black tracking-tighter leading-none uppercase italic !text-white force-text-contrast">Alternative Paths</h2>
                            <p className="text-lg text-slate-300 font-medium">Other career trajectories that align with your profile</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {(chatCareers.length > 1 ? chatCareers.slice(1, 4) : [
                                { title: "Data Scientist", matchScore: 92, salary: "₹15L – ₹28L", growth: "High" },
                                { title: "Robotics Engineer", matchScore: 88, salary: "₹12L – ₹24L", growth: "Rising" },
                                { title: "AI Product Manager", matchScore: 85, salary: "₹20L – ₹40L", growth: "Extreme" }
                            ]).map((career: any, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col group relative overflow-hidden h-full"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                                        <TrendingUp className="h-24 w-24 text-white" />
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{career.matchScore || 85}% Match</p>
                                            <h3 className="text-2xl font-bold !text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{career.title}</h3>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-6">
                                        <div className="flex justify-between border-t border-white/10 pt-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Salary</p>
                                                <p className="font-bold !text-white">{career.salaryRange ? `₹${career.salaryRange.min/100000}L – ₹${career.salaryRange.max/100000}L` : career.salary}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</p>
                                                <p className="font-bold text-emerald-400">{career.outlook || career.growth}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/10 font-bold group">
                                            Explore Path
                                            <ArrowUpRight className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 10. AI EXPLANATION SECTION */}
                <section className="py-32 bg-slate-900/50 border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black tracking-tighter leading-tight uppercase italic !text-white force-text-contrast">How This Roadmap <br /> Was Generated</h2>
                                    <p className="text-lg text-slate-300 font-medium">Our AI analyzes thousands of data points to craft your unique journey.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: "Profile Analysis", desc: "Evaluating your current skills & interests", icon: Search },
                                        { title: "Skill Gap Detection", desc: "Identifying what you need to reach your goal", icon: Cpu },
                                        { title: "Career Matching", desc: "Finding the best-fit destination milestones", icon: Target },
                                        { title: "Course Curation", desc: "Selecting top courses to bridge the gap", icon: Sparkles }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold italic">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold !text-white uppercase tracking-tight text-xs force-text-contrast">{step.title}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-1/3 flex justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="relative w-64 h-64 md:w-80 md:h-80 opacity-40"
                                >
                                    <div className="absolute inset-0 rounded-full border-[20px] border-dashed border-blue-500/20" />
                                    <div className="absolute inset-4 rounded-full border-[2px] border-cyan-500/30" />
                                    <div className="absolute inset-10 rounded-full border-[10px] border-spacing-4 border-dashed border-indigo-500/20" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 12. CTA SECTION */}
                <CTASection />

                {/* 13. FOOTER */}
                <MainFooter />
            </div>
        </ProtectedRoute>
    );
}
