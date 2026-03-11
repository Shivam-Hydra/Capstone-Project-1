"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Forced Recompile: Pricing Reset to 99

const plans = [
    {
        name: "FREE",
        price: "₹0",
        period: "/forever",
        desc: "The essential kit for every student looking for clarity.",
        icon: Zap,
        features: [
            "5 AI chat messages per day",
            "3 career roadmaps",
            "Basic course recommendations",
            "Career explore page",
            "Save up to 3 careers",
            "Profile creation"
        ],
        cta: "Get Started",
        popular: false
    },
    {
        name: "PRO",
        price: "₹99",
        period: "/per month",
        desc: "For those who want to use the full power of AI for their career.",
        icon: Star,
        features: [
            "Unlimited AI conversations",
            "Unlimited roadmaps",
            "Personality assessment & matching",
            "Resume and cover letter review",
            "Premium course resources",
            "Career mentoring sessions",
            "Priority support & expert help"
        ],
        cta: "Choose Plan",
        popular: true
    },
    {
        name: "INSTITUTION",
        price: "Custom",
        period: "",
        desc: "Tailored solutions for colleges and organizations.",
        icon: ShieldCheck,
        features: [
            "Everything in Pro",
            "Bulk student accounts",
            "Admin dashboard",
            "Usage analytics",
            "Dedicated support",
            "Custom branding"
        ],
        cta: "Contact Us",
        popular: false
    }
];

export function PricingSection() {
    return (
        <section className="py-32 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">Pricing</div>
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
                        Pay for <span className="text-indigo-500">Clarity.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">
                        Invest in your future with plans that scale with your ambitions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "p-10 rounded-[48px] border transition-all duration-500 relative flex flex-col group h-full",
                                plan.popular
                                    ? "bg-blue-600 border-blue-400 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] scale-105 z-10"
                                    : "bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-500/50 hover:shadow-xl text-white"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-yellow-500 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-xl z-20">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl",
                                    plan.popular ? "bg-white text-blue-600" : "bg-blue-500/10 text-blue-400"
                                )}>
                                    <plan.icon className="h-7 w-7" />
                                </div>
                                <h3 className={cn(
                                    "text-2xl font-black tracking-tight mb-2",
                                    plan.popular ? "text-white" : "text-white"
                                )}>{plan.name}</h3>
                                <p className={cn(
                                    "text-sm font-medium leading-relaxed",
                                    plan.popular ? "text-blue-100" : "text-slate-300"
                                )}>{plan.desc}</p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-2">
                                <span className={cn(
                                    "text-5xl font-black tracking-tighter",
                                    plan.popular ? "text-white" : "text-white"
                                )}>{plan.price}</span>
                                {plan.period && (
                                    <span className={cn(
                                        "text-sm font-medium",
                                        plan.popular ? "text-blue-200" : "text-slate-400"
                                    )}>{plan.period}</span>
                                )}
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <Check className={cn(
                                            "h-4 w-4 shrink-0",
                                            plan.popular ? "text-white" : "text-blue-500"
                                        )} />
                                        <span className={cn(
                                            "text-sm font-bold",
                                            plan.popular ? "text-white" : "text-slate-300"
                                        )}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn(
                                    "w-full h-16 rounded-[24px] font-black text-base transition-all active:scale-95 shadow-xl",
                                    plan.popular
                                        ? "bg-white text-blue-600 hover:bg-white/90 shadow-blue-900/40"
                                        : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-blue-500"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
