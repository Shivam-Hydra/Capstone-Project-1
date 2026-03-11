"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-20 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-12 md:p-24 rounded-[64px] bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Sparkles className="h-64 w-64 text-white rotate-12" />
                    </div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Ready to Map Your <br />
                            <span className="italic">Destiny?</span>
                        </h2>

                        <p className="text-xl text-blue-100 font-medium">
                            Join over 50,000 students and professionals who have found their path using CareerAI. Start your journey today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/chat">
                                <Button className="h-16 px-12 text-lg bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black shadow-2xl active:scale-95 transition-all flex items-center gap-3">
                                    Start Your Chat
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="outline" className="h-16 px-12 text-lg bg-transparent border-white/20 text-white hover:bg-white/10 rounded-2xl font-black transition-all">
                                    View Plans
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
