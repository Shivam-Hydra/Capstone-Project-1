"use client";

import { BrainCircuit, Compass, Layers, Zap } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { motion } from "framer-motion";

const features = [
    {
        name: "AI-Powered Analysis",
        description: "Deep analysis of your skills and interests to find high-probability career matches.",
        icon: BrainCircuit,
    },
    {
        name: "Dual Input System",
        description: "Flexible input options. Type freely or use structured selection tools.",
        icon: Layers,
    },
    {
        name: "Dynamic Roadmaps",
        description: "Step-by-step actionable plans tailored to your specific timeline and goals.",
        icon: Compass,
    },
    {
        name: "Instant Insights",
        description: "Real-time feedback on skill gaps with curated course recommendations.",
        icon: Zap,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function Features() {
    return (
        <section className="py-20 relative w-full bg-secondary/30 border-t border-border">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4 tracking-tight">
                        Intelligence Meets Intuition
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        A comprehensive system designed to navigate the complexities of modern career paths with clarity.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature) => (
                        <motion.div key={feature.name} variants={item}>
                            <TiltCard className="h-full">
                                <div
                                    className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-xl transition-all group h-full cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <feature.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground mb-2">{feature.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
