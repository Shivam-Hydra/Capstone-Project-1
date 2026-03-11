"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
    Sparkles, BrainCircuit, Map, BookOpen, Shield, LineChart, 
    Zap, Users, ArrowRight, Check, Play, Globe, Target, 
    BarChart3, MousePointer2, MessageSquare, GraduationCap,
    Cpu, Search, Briefcase, IndianRupee, Rocket, Heart
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Components ---

const MeshBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
);

const FeatureSection = ({ 
    title, 
    subtitle, 
    description, 
    bullets, 
    visual, 
    reverse = false,
    label
}: { 
    title: string;
    subtitle?: string;
    description: string;
    bullets: string[];
    visual: React.ReactNode;
    reverse?: boolean;
    label?: string;
}) => (
    <section className="py-24 md:py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
            <div className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
                reverse && "lg:flex-row-reverse"
            )}>
                <motion.div 
                    initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn("space-y-6", reverse && "lg:order-2")}
                >
                    {label && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-2">
                            {label}
                        </div>
                    )}
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {title}
                        {subtitle && <span className="block text-blue-400 italic mt-1">{subtitle}</span>}
                    </h2>
                    <p className="text-lg text-slate-200 font-medium leading-relaxed max-w-xl">
                        {description}
                    </p>
                    <div className="space-y-4 pt-4">
                        {bullets.map((bullet, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-slate-300 font-bold"
                            >
                                <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                                    <Check className="h-3.5 w-3.5" />
                                </div>
                                {bullet}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotateY: reverse ? -10 : 10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    className={cn("relative", reverse && "lg:order-1")}
                >
                    {visual}
                </motion.div>
            </div>
        </div>
    </section>
);

// --- Visual Mockups ---

const AIChatMockup = () => (
    <div className="bg-[#1E293B] rounded-3xl border border-white/10 shadow-2xl p-6 space-y-4 relative overflow-hidden aspect-video lg:aspect-square">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <div className="text-xs font-black text-white/50 tracking-widest uppercase">AI COUNSELOR</div>
        </div>
        <div className="space-y-4">
            <div className="flex justify-end pr-4">
                <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 text-[10px] font-bold text-white max-w-[80%]">
                    I'm interested in AI research, what skills should I start with?
                </div>
            </div>
            <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-[10px] text-slate-300 font-medium max-w-[90%]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 mb-2 text-blue-400"
                    >
                        <Sparkles className="h-3 w-3" /> Thinking...
                    </motion.div>
                    Great choice! AI Research focuses heavily on mathematical foundations...
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-bold text-blue-400">Calculus & Linear Algebra</div>
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-bold text-blue-400">Deep Learning (PyTorch)</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#1E293B] to-transparent z-10" />
    </div>
);

const RoadmapTimelineMockup = () => {
    const nodes = [
        { year: "2025", title: "Learn Python Foundations", active: true },
        { year: "2026", title: "Master Machine Learning", active: false },
        { year: "2027", title: "AI Research Internship", active: false }
    ];
    return (
        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-12 relative overflow-hidden min-h-[400px]">
            <div className="absolute top-10 bottom-10 left-16 w-0.5 bg-white/10" />
            {nodes.map((node, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex items-center gap-8 relative z-10"
                >
                    <div className={cn(
                        "h-4 w-4 rounded-full border-4 border-[#1E293B] ring-4 shrink-0 transition-colors",
                        node.active ? "bg-blue-500 ring-blue-500/20" : "bg-white/10 ring-white/5"
                    )} />
                    <div className="space-y-1">
                        <div className={cn("text-xs font-black uppercase tracking-widest", node.active ? "text-blue-400" : "text-slate-500")}>
                            {node.year}
                        </div>
                        <div className="text-lg font-bold text-white tracking-tight">{node.title}</div>
                    </div>
                </motion.div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Map className="h-64 w-64 text-white" />
            </div>
        </div>
    );
};

const CourseDiscoveryMockup = () => (
    <div className="relative group perspective-[1000px] h-64 lg:h-96">
        {[
            { name: "NPTEL", color: "bg-orange-500", icon:IndianRupee, top: "10%", left: "10%" },
            { name: "Coursera", color: "bg-blue-500", icon:GraduationCap, top: "20%", left: "30%" },
            { name: "YouTube", color: "bg-red-500", icon:Play, top: "50%", left: "15%" },
            { name: "MIT OCW", color: "bg-slate-500", icon:Globe, top: "40%", left: "45%" }
        ].map((course, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotateY: 45 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className={cn(
                    "absolute p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-3 bg-[#1E293B]/80 backdrop-blur-md",
                    course.color
                )}
                style={{ top: course.top, left: course.left }}
                animate={{ 
                    y: [0, -10, 0],
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <course.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-black text-white tracking-widest uppercase">{course.name}</span>
            </motion.div>
        ))}
        {/* Animated flow line */}
        <motion.div 
            animate={{ 
                width: ["0%", "80%"], 
                opacity: [0, 1, 0] 
            }}
            transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute top-1/2 left-[10%] h-[2px] bg-gradient-to-r from-blue-500 to-transparent"
        />
    </div>
);

const MatchIntelligenceMockup = () => (
    <div className="bg-[#1E293B] rounded-3xl border border-white/10 p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Career Match Scores</h4>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        {[
            { label: "AI Engineer", match: 92, color: "from-blue-500 to-indigo-500" },
            { label: "Data Scientist", match: 85, color: "from-purple-500 to-pink-500" },
            { label: "Robotics Engineer", match: 73, color: "from-emerald-500 to-teal-500" }
        ].map((item, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-white">{item.label}</span>
                    <span className="text-xs font-black text-white/50">{item.match}% MATCH</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.match}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className={cn("h-full rounded-full bg-gradient-to-r relative shadow-[0_0_15px_rgba(59,130,246,0.3)]", item.color)}
                    >
                        <div className="absolute inset-0 bg-white/20" />
                    </motion.div>
                </div>
            </div>
        ))}
    </div>
);

const IndiaMapMockup = () => (
    <div className="bg-[#1E293B] rounded-3xl border border-white/10 p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <Globe className="h-[400px] w-[400px] text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
            {[
                { city: "Bangalore", role: "AI Engineer", sal: "₹18L+" },
                { city: "Hyderabad", role: "Data Scientist", sal: "₹16L+" },
                { city: "Pune", role: "ML Engineer", sal: "₹15L+" },
                { city: "Mumbai", role: "Product Manager", sal: "₹20L+" }
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 hover:bg-white/10 transition-colors cursor-default"
                >
                    <div className="text-[8px] font-black uppercase text-blue-400 tracking-widest">{stat.city}</div>
                    <div className="text-sm font-bold text-white tracking-tight">{stat.role}</div>
                    <div className="text-base font-black text-green-400">{stat.sal}</div>
                </motion.div>
            ))}
        </div>
    </div>
);

const ProfileExtractionMockup = () => (
    <div className="bg-[#1E293B] rounded-3xl border border-white/10 p-8 space-y-6 aspect-square lg:aspect-video overflow-hidden">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-400 font-mono italic leading-relaxed">
            "I like physics and AI, I'm currently studying Computer Science and I want to work in robotics."
        </div>
        <div className="flex flex-col items-center gap-2">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 rounded-full border-2 border-dashed border-blue-500/50 flex items-center justify-center"
            >
                <Cpu className="h-5 w-5 text-blue-400" />
            </motion.div>
            <div className="text-[8px] font-black uppercase tracking-widest text-blue-400">Extracting Entities...</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: "Interest", value: "Physics" },
                { label: "Subject", value: "Comp Science" },
                { label: "Field", value: "AI" },
                { label: "Goal", value: "Robotics" }
            ].map((tag, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    className="flex flex-col p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                >
                    <span className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{tag.label}</span>
                    <span className="text-xs font-black text-white">{tag.value}</span>
                </motion.div>
            ))}
        </div>
    </div>
);

// --- Main Page ---

export default function FeaturesPage() {
    return (
        <main className="dark min-h-screen bg-[#0F172A] relative text-white selection:bg-blue-500/30">
            <MeshBackground />

            {/* Hero Section */}
            <section className="pt-12 md:pt-20 pb-32 relative z-10 overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                    >
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase"
                            >
                                <Rocket className="h-3.5 w-3.5" /> Everything You Need
                            </motion.div>
                            
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-white"
                            >
                                The AI System <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 italic">That Maps Your</span> <br />
                                Career.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-200 max-w-xl font-medium leading-relaxed"
                            >
                                From exploration to expertise — CareerAI guides every step of your journey with intelligent analysis and personalized roadmaps.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Button className="h-16 px-10 rounded-[24px] bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] group">
                                    Start Free
                                    <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button className="h-16 px-10 rounded-[24px] bg-white/10 border border-white/20 text-white font-black text-lg hover:bg-white/20 transition-all active:scale-95">
                                    Watch Demo
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative perspective-[1000px]"
                        >
                            <div className="grid grid-cols-2 gap-6 rotate-3 hover:rotate-0 transition-transform duration-700">
                                <div className="space-y-6 pt-12">
                                    <div className="p-6 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-float">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                            <MessageSquare className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">AI Career Chat</div>
                                        <div className="h-1 w-12 bg-blue-500/20 rounded-full" />
                                    </div>
                                    <div className="p-6 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-float-delayed">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                                            <Map className="h-4 w-4 text-indigo-400" />
                                        </div>
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Career Roadmap</div>
                                        <div className="h-1 w-12 bg-indigo-500/20 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-float-delayed">
                                        <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                                            <BarChart3 className="h-4 w-4 text-purple-400" />
                                        </div>
                                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Skill Gap Analysis</div>
                                        <div className="h-1 w-12 bg-purple-500/20 rounded-full" />
                                    </div>
                                    <div className="p-6 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-float">
                                        <div className="h-8 w-8 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                                            <Sparkles className="h-4 w-4 text-pink-400" />
                                        </div>
                                        <div className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Course Recommends</div>
                                        <div className="h-1 w-12 bg-pink-500/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Pillar Sections */}
            <FeatureSection 
                label="Section 1"
                title="AI Career"
                subtitle="Intelligence"
                description="Chat with an intelligent system that understands your background, skills, and ambitions to give personalized career guidance."
                bullets={["Smart career conversations", "Context-aware advice", "Personalized career suggestions"]}
                visual={<AIChatMockup />}
            />

            <FeatureSection 
                label="Section 2"
                title="Personalized"
                subtitle="Career Roadmaps"
                description="Nodes appear as you move forward. CareerAI builds a dynamic timeline from where you are to where you want to be."
                bullets={["Year-by-year planning", "Milestone tracking", "Skill foundations"]}
                visual={<RoadmapTimelineMockup />}
                reverse
            />

            <FeatureSection 
                label="Section 3"
                title="Smart Course"
                subtitle="Discovery"
                description="AI recommends courses based on skill gaps. No random suggestions — only targeted learning paths from top platforms."
                bullets={["NPTEL & Coursera integration", "YouTube curated paths", "MIT OpenCourseWare"]}
                visual={<CourseDiscoveryMockup />}
            />

            <FeatureSection 
                label="Section 4"
                title="Career Match"
                subtitle="Analysis"
                description="See how well each career aligns with your unique profile. We analyze your interests against industry demands."
                bullets={["Match percentage scores", "Role-specific breakdowns", "Skill validation"]}
                visual={<MatchIntelligenceMockup />}
                reverse
            />

            <FeatureSection 
                label="Section 5"
                title="India-Focused"
                subtitle="Market Data"
                description="CareerAI integrates Indian job market insights, salary benchmarks, and skill demand data specifically for our region."
                bullets={["INR salary estimates", "City-wise demand", "Local industry context"]}
                visual={<IndiaMapMockup />}
            />

            <FeatureSection 
                label="Section 6"
                title="Instant Profile"
                subtitle="Creation"
                description="Describe yourself in plain text. Our AI extracts your education, skills, and goals to build a profile in seconds."
                bullets={["Natural language extraction", "Multi-skill identification", "Interest analysis"]}
                visual={<ProfileExtractionMockup />}
                reverse
            />

            {/* Interactive Grid */}
            <section className="py-32 border-t border-white/5 bg-white/[0.01]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-20 text-white">Interactive Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Secure & Private", icon: Shield, desc: "Your data is encrypted and private." },
                            { title: "Instant Analysis", icon: Zap, desc: "Profiles built in under 10 seconds." },
                            { title: "India-Focused", icon: IndianRupee, desc: "Built for local student needs." },
                            { title: "Always Updated", icon: Sparkles, desc: "Real-time industry trend data." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10, borderColor: "rgba(59,130,246,0.5)" }}
                                className="p-8 rounded-[32px] bg-white/5 border border-white/10 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                    <feature.icon className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight mb-2 uppercase text-white">{feature.title}</h3>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Workflow */}
            <section className="py-32 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24 space-y-4">
                        <div className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">Product Flow</div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">How CareerAI Works</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute top-[3.5rem] left-0 right-0 h-0.5 bg-white/5 hidden lg:block" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                            {[
                                { step: "01", title: "Describe Yourself", desc: "Talk about your interests in plain text." },
                                { step: "02", title: "AI Skill Analysis", desc: "We identify your hidden strengths." },
                                { step: "03", title: "Paths Generated", desc: "Multiple career trajectories built." },
                                { step: "04", title: "Roadmap Active", desc: "Step-by-step plan is activated." }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 group"
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center text-xl font-black text-blue-500 group-hover:border-blue-500/50 transition-colors z-10 shadow-xl">
                                        {item.step}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black tracking-tight text-white uppercase">{item.title}</h4>
                                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">Success Stories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { quote: "CareerAI helped me find a path into AI research I never knew existed.", author: "Arjun K.", role: "B.Tech Student" },
                            { quote: "The roadmaps are a game changer. I know exactly what to learn every month.", author: "Sanya M.", role: "Software Engineer" },
                            { quote: "I extracted my whole career goal from just one sentence. Pure magic.", author: "Rahul P.", role: "Career Starter" }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 relative group"
                            >
                                <div className="flex gap-1 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <Sparkles key={i} className="h-3 w-3 fill-current" />)}
                                </div>
                                <p className="text-lg text-slate-300 font-medium italic">"{t.quote}"</p>
                                <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center font-black text-blue-400">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-white uppercase tracking-wider">{t.author}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <motion.div
                        whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                        className="relative rounded-[64px] overflow-hidden p-12 md:p-24 text-center bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 border border-blue-400/30 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]"
                    >
                        <div className="absolute inset-0 overflow-hidden opacity-30">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] border-[40px] border-white/5 rounded-full border-dashed"
                            />
                        </div>

                        <div className="relative z-10 space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
                                Ready to Map Your<br />Future Today?
                            </h2>
                            <p className="text-white/60 text-xl font-medium max-w-xl mx-auto">
                                Join 10,000+ students already building their dream careers with AI.
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <Button className="h-16 px-12 rounded-[24px] bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all active:scale-95 group">
                                    Start Free
                                    <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button className="h-16 px-12 rounded-[24px] bg-transparent border-2 border-white/20 text-white font-black text-lg hover:bg-white/10 transition-all active:scale-95">
                                    Explore Careers
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Comparison Table Section */}
            <section className="py-32 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">The CareerAI Edge</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px] border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-8 text-xs font-black tracking-widest text-slate-500 uppercase">Features</th>
                                    <th className="py-8 text-xs font-black tracking-widest text-slate-500 uppercase text-center w-1/4">Traditional</th>
                                    <th className="py-8 text-xs font-black tracking-widest text-blue-400 uppercase text-center w-1/4">CareerAI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { f: "Personalization", t: "Generic Advice", c: "Deep AI Customization" },
                                    { f: "Career Paths", t: "Static PDF/Books", c: "Dynamic Roadmaps" },
                                    { f: "Insights", t: "Limited Industry Data", c: "Real-time AI Analysis" },
                                    { f: "Speed", t: "Days of Research", c: "Instant (10 Seconds)" },
                                    { f: "Local Data", t: "Mostly Global/US", c: "India-Market Insights" }
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-8 text-sm font-black text-slate-300 uppercase tracking-tight">{row.f}</td>
                                        <td className="py-8 text-center text-sm font-medium text-slate-500">{row.t}</td>
                                        <td className="py-8 text-center text-base font-black text-white bg-blue-500/5">{row.c}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
