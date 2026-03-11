"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import { Check, Sparkles, Zap, Star, ShieldCheck, ArrowRight, Minus, ChevronDown, Users, BarChart, Target } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 500;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{displayValue}</span>;
};

const MeshBackground = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Floating Particles - Client Only to avoid hydration mismatch */}
            {isMounted && [...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%",
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                    animate={{ 
                        y: [null, (Math.random() * -100 - 50) + "px"],
                        opacity: [null, 0]
                    }}
                    transition={{ 
                        duration: Math.random() * 5 + 5, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                />
            ))}
        </div>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-400 font-medium leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Free",
            monthlyPrice: 0,
            yearlyPrice: 0,
            description: "Perfect for exploring career options.",
            cta: "Start Exploring",
            ctaHref: "/signup",
            highlight: false,
            features: ["5 AI chat messages per day", "3 career roadmaps", "Basic recommendations", "Career explore page", "Profile creation"],
        },
        {
            name: "Pro",
            monthlyPrice: 99,
            yearlyPrice: 79,
            description: "For serious job seekers who want unlimited guidance.",
            badge: "MOST POPULAR",
            cta: "Upgrade to Pro",
            ctaHref: "/signup",
            highlight: true,
            features: ["Unlimited AI conversations", "Unlimited roadmaps", "Personality assessment", "Resume review", "Premium resources", "Mentoring sessions"],
        },
        {
            name: "Institution",
            type: "custom",
            description: "Tailored solutions for colleges and organizations.",
            cta: "Book a Demo",
            ctaHref: "mailto:contact@careerai.app",
            highlight: false,
            features: ["Bulk student accounts", "Admin dashboard", "Usage analytics", "Dedicated support", "Custom branding"],
        }
    ];

    const comparisons = [
        { feature: "AI Conversations", free: "5/day", pro: "Unlimited", inst: "Unlimited" },
        { feature: "Career Roadmaps", free: "3", pro: "Unlimited", inst: "Unlimited" },
        { feature: "Career Match Score", free: false, pro: true, inst: true },
        { feature: "Analytics", free: false, pro: false, inst: true },
        { feature: "Bulk Students", free: false, pro: false, inst: true },
        { feature: "Priority Support", free: false, pro: true, inst: true },
    ];

    return (
        <main className="dark min-h-screen bg-[#0F172A] relative text-white selection:bg-blue-500/30">
            <MeshBackground />

            {/* Hero Section */}
            <div className="container mx-auto px-6 relative z-10">
                <section className="pt-12 pb-20 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mx-auto"
                    >
                        <Zap className="h-3.5 w-3.5" /> Simple Pricing
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter text-white"
                    >
                        Start Free.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">Scale Your Career</span> When Ready.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-200 max-w-2xl mx-auto font-medium"
                    >
                        CareerAI grows with you — from exploration to mastery.
                    </motion.p>

                    {/* Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-4 pt-4"
                    >
                        <span className={cn("text-sm font-black tracking-widest uppercase transition-colors", !isYearly ? "text-white" : "text-slate-500")}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-8 bg-slate-800 rounded-full relative p-1 group border border-white/5"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 24 : 0 }}
                                className="w-6 h-6 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-black tracking-widest uppercase transition-colors", isYearly ? "text-white" : "text-slate-500")}>Yearly</span>
                            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-black text-green-400 animate-pulse">
                                SAVE 20%
                            </span>
                        </div>
                    </motion.div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-32 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={cn(
                                "p-10 rounded-[48px] border transition-all duration-500 relative flex flex-col h-full group",
                                plan.highlight
                                    ? "bg-gradient-to-b from-blue-600 to-indigo-700 border-blue-400/50 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)]"
                                    : "bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-500/50 shadow-2xl"
                            )}
                        >
                            {plan.badge && (
                                <motion.div
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-[0_10px_20px_-5px_rgba(234,179,8,0.5)] z-30 flex items-center gap-1.5 whitespace-nowrap border border-yellow-200/20"
                                >
                                    <Sparkles className="h-3 w-3 fill-white" /> {plan.badge}
                                </motion.div>
                            )}

                            {/* Hover Spotlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="mb-8 relative z-10">
                                <h3 className="text-sm font-black tracking-[0.2em] text-blue-400 uppercase mb-4">{plan.name}</h3>
                                <div className="flex flex-col gap-1 mb-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-6xl font-black tracking-tighter">
                                            {plan.type === 'custom' ? 'Custom' : (
                                                <>₹<AnimatedNumber value={isYearly ? plan.yearlyPrice! : plan.monthlyPrice!} /></>
                                            )}
                                        </span>
                                        {plan.type !== 'custom' && (
                                            <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">/month</span>
                                        )}
                                    </div>
                                    {plan.highlight && (
                                        <p className="text-xs font-black text-blue-200 uppercase tracking-widest mt-2">
                                            Students using Pro get careers 3x faster
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-slate-300 leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-12 flex-1 relative z-10">
                                {plan.features.map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group/item">
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            className={cn(
                                                "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                                plan.highlight ? "bg-white/10 text-white" : "bg-blue-500/10 text-blue-500"
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </motion.div>
                                        <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors">{f}</span>
                                    </div>
                                ))}
                                {plan.name === 'Institution' && (
                                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                                            <span>Student Tracker</span>
                                            <BarChart className="h-3 w-3" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3 w-3 text-blue-400" />
                                                <span className="text-[10px] font-bold">2,400 students active</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target className="h-3 w-3 text-indigo-400" />
                                                <span className="text-[10px] font-bold">92% Placement rate</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                className={cn(
                                    "w-full h-16 rounded-[24px] font-black text-base transition-all active:scale-95 shadow-xl relative z-10 overflow-hidden group/btn",
                                    plan.highlight
                                        ? "bg-white text-blue-600 hover:bg-blue-50"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                                {plan.highlight && (
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </section>

                {/* Why Pro Section */}
                <section className="py-32 border-t border-white/5">
                    <div className="text-center mb-20 space-y-4">
                        <div className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">Benefits</div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase whitespace-pre-line text-white">Why Students{"\n"}Choose Pro</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: "Unlimited AI Mentoring", icon: Sparkles, desc: "24/7 guidance for your career." },
                            { title: "Career Match Scoring", icon: Target, desc: "See exactly where you fit." },
                            { title: "Personalized Skill Gaps", icon: BarChart, desc: "Know what to learn next." },
                            { title: "Smart Roadmaps", icon: Zap, desc: "Dynamic paths to success." }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5, borderColor: "rgba(59,130,246,0.3)" }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 transition-all duration-300 group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <card.icon className="h-6 w-6 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-black tracking-tight mb-2 uppercase text-white">{card.title}</h4>
                                <p className="text-sm text-slate-300 font-medium">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-32 border-t border-white/5">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">Compare Plans</h2>
                    </div>
                    <div className="w-full">
                        <table className="w-full text-left min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-6 text-xs font-black tracking-widest text-slate-400 uppercase">Feature</th>
                                    <th className="py-6 text-xs font-black tracking-widest text-slate-400 uppercase text-center">Free</th>
                                    <th className="py-6 text-xs font-black tracking-widest text-blue-400 uppercase text-center">Pro</th>
                                    <th className="py-6 text-xs font-black tracking-widest text-slate-400 uppercase text-center">Institution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((item, i) => (
                                    <motion.tr
                                        key={item.feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-6 text-sm font-bold text-slate-300">{item.feature}</td>
                                        <td className="py-6 text-center">
                                            {typeof item.free === 'boolean' ? (
                                                item.free ? <Check className="h-5 w-5 text-blue-500 mx-auto" /> : <Minus className="h-5 w-5 text-slate-700 mx-auto" />
                                            ) : <span className="text-sm font-bold text-slate-400">{item.free}</span>}
                                        </td>
                                        <td className="py-6 text-center bg-blue-500/5">
                                            {typeof item.pro === 'boolean' ? (
                                                <Check className="h-5 w-5 text-blue-400 mx-auto" />
                                            ) : <span className="text-sm font-black text-white">{item.pro}</span>}
                                        </td>
                                        <td className="py-6 text-center">
                                            {typeof item.inst === 'boolean' ? (
                                                <Check className="h-5 w-5 text-indigo-400 mx-auto" />
                                            ) : <span className="text-sm font-bold text-slate-400">{item.inst}</span>}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-32 border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">Support</div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">Frequently<br />Asked Questions</h2>
                            <p className="text-slate-300 font-medium text-lg leading-relaxed max-w-sm">
                                Everything you need to know about the plans and features.
                            </p>
                            <Button className="h-14 rounded-2xl bg-white/10 border border-white/20 text-white font-bold px-8 hover:bg-white/20 hover:border-blue-500/50 transition-all shadow-lg active:scale-95">
                                Email Support
                            </Button>
                        </div>
                        <div className="divide-y divide-white/10">
                            {[
                                { q: "Is CareerAI free for students?", a: "Yes, our Free plan is designed specifically for students to explore careers without any cost. You get basic AI features to start mapping your future." },
                                { q: "Can I cancel my Pro subscription?", a: "Absolutely. You can cancel your Pro subscription at any time from your settings page. You'll retain access until the end of your billing cycle." },
                                { q: "What is an Institution account?", a: "Institution accounts are designed for universities and coaching centers to manage multiple student accounts, track progress, and access customized analytics." },
                                { q: "Do you offer discounts for groups?", a: "Yes, for groups of 10 or more learners, we offer preferred pricing. Please contact our sales team for more information." }
                            ].map((faq, i) => (
                                <FAQItem key={i} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32">
                    <motion.div
                        whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                        className="relative rounded-[64px] overflow-hidden p-12 md:p-24 text-center bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 border border-blue-400/30 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]"
                    >
                        {/* Animated background patterns for CTA */}
                        <div className="absolute inset-0 overflow-hidden opacity-30">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] border-[40px] border-white/5 rounded-full border-dashed"
                            />
                        </div>

                        <div className="relative z-10 space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
                                Start Mapping Your<br />Future Today
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <Button className="h-16 px-10 rounded-[24px] bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all active:scale-95 group">
                                    Start Free
                                    <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button className="h-16 px-10 rounded-[24px] bg-blue-500/20 border-2 border-white/20 text-white font-black text-lg hover:bg-white/10 transition-all active:scale-95">
                                    Get Pro Plan
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
