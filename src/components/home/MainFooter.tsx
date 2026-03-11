"use client";

import { motion } from "framer-motion";
import { Sparkles, Twitter, Linkedin, Github, MessageSquare, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MainFooter() {
    return (
        <footer className="bg-[#0F172A] pt-32 pb-12 relative overflow-hidden">
            {/* Top Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">

                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">CareerAI</span>
                        </Link>

                        <div className="space-y-4 max-w-sm">
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Join 5,000+ ambitious individuals receiving weekly AI career insights.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Newsletter"
                                    className="h-10 flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <Button className="h-10 aspect-square p-0 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-900/40">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black tracking-[0.2em] text-blue-500 uppercase">Product</h4>
                        <ul className="space-y-4">
                            {["Roadmap Generator", "Skill Mapping", "AI Mentor", "Explore Careers", "Pricing"].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-tight">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black tracking-[0.2em] text-indigo-500 uppercase">Company</h4>
                        <ul className="space-y-4">
                            {["About Us", "Careers", "Blog", "Privacy", "Terms"].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-tight">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Developers */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black tracking-[0.2em] text-purple-500 uppercase">Developers</h4>
                        <ul className="space-y-4">
                            {["Documentation", "API Reference", "System Status", "Open Source"].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-tight">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community (Socials) */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black tracking-[0.2em] text-pink-500 uppercase">Community</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Twitter", icon: Twitter },
                                { name: "LinkedIn", icon: Linkedin },
                                { name: "GitHub", icon: Github },
                                { name: "Discord", icon: MessageSquare }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors group">
                                        <item.icon className="h-4 w-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
                                        <span className="uppercase tracking-tight">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                        © 2026 CareerAI. All rights reserved. Precision Engineering.
                    </p>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full shadow-inner">
                        <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">🚀 Built with AI and real career data</span>
                    </div>

                    <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
