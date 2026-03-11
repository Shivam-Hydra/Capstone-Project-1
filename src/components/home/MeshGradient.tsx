"use client";

import { motion } from "framer-motion";

export function MeshGradient() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base Background */}
            <div className="absolute inset-0 bg-[#0F172A]" />

            {/* Mesh Gradients */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: ["-10%", "10%", "-10%"],
                    y: ["-10%", "5%", "-10%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#2563EB]/20 blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: ["10%", "-5%", "10%"],
                    y: ["10%", "-10%", "10%"],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#60A5FA]/10 blur-[100px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: ["0%", "5%", "0%"],
                    y: ["0%", "10%", "0%"],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#1E293B]/30 blur-[80px]"
            />

            {/* Subtle floating blurred shapes */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    x: [0, 20, 0],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"
            />

            <motion.div
                animate={{
                    y: [0, 60, 0],
                    x: [0, -30, 0],
                    rotate: [0, -120, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl shadow-[0_0_100px_rgba(79,70,229,0.1)]"
            />

            {/* Radial Overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(37,99,235,0.1),_transparent_50%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-[#0F172A]" />
        </div>
    );
}
