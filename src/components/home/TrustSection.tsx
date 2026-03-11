"use client";

import { motion } from "framer-motion";

const institutions = [
    "IIT Bombay", "IISER Pune", "MIT", "Stanford", "IIT Delhi", "BITS Pilani", "Harvard", "ETH Zurich", "IISc Bangalore", "Oxford"
];

export function TrustSection() {
    return (
        <div className="py-20 bg-[#0F172A] relative overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 mb-12 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.6, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm font-bold tracking-[0.3em] text-white uppercase mb-4"
                >
                    Elite Talent from Global Institutions
                </motion.p>
            </div>

            {/* Horizontal Ticker */}
            <div className="flex overflow-hidden relative group">
                {/* Overlay gradients for fade effect on edges */}
                <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-[#0F172A] to-transparent z-10" />
                <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-[#0F172A] to-transparent z-10" />

                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex whitespace-nowrap gap-16 items-center px-8"
                >
                    {/* Double the list for seamless loop */}
                    {[...institutions, ...institutions].map((name, idx) => (
                        <div
                            key={idx}
                            className="text-2xl md:text-3xl font-black text-white/20 hover:text-white transition-colors duration-500 cursor-default flex items-center gap-4 italic select-none"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {name}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}
