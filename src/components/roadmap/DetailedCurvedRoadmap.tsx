"use client";

import { useEffect, useState, useRef } from "react";
import { Roadmap, RoadmapStep } from "@/types";
import { motion } from "framer-motion";
import { BookOpen, Hammer, Award, Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailedCurvedRoadmapProps {
    roadmap: Roadmap;
}

export function DetailedCurvedRoadmap({ roadmap }: DetailedCurvedRoadmapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Combine steps in order
    const timelineNodes = [
        ...roadmap.steps.shortTerm.map(s => ({ ...s, phase: "0-6 Months", color: "blue" })),
        ...roadmap.steps.midTerm.map(s => ({ ...s, phase: "6-24 Months", color: "purple" })),
        ...roadmap.steps.longTerm.map(s => ({ ...s, phase: "2+ Years", color: "emerald" }))
    ];

    // SVG path calculations
    useEffect(() => {
        const calculatePoints = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const nodes = container.querySelectorAll('.timeline-node');
            const newPoints: { x: number; y: number }[] = [];

            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const iconContainer = node.querySelector('.node-icon');
                
                if (iconContainer) {
                    const iconRect = iconContainer.getBoundingClientRect();
                    newPoints.push({
                        x: iconRect.left - containerRect.left + iconRect.width / 2,
                        y: iconRect.top - containerRect.top + iconRect.height / 2
                    });
                }
            });
            setPoints(newPoints);

            if (canvasRef.current && container) {
                canvasRef.current.width = container.offsetWidth;
                canvasRef.current.height = container.offsetHeight;
            }
        };

        const timeoutId = setTimeout(calculatePoints, 100);
        
        // Handle scroll progression
        const handleScroll = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            // Calculate how much of the container has been scrolled past
            const windowHeight = window.innerHeight;
            const scrollableDistance = rect.height - windowHeight / 2;
            const scrolled = Math.max(0, (windowHeight / 2) - rect.top);
            const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));
            setScrollProgress(progress);
        };

        window.addEventListener('resize', calculatePoints);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial scroll calculation
        handleScroll();

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calculatePoints);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [timelineNodes.length]);

    // Draw the mathematical path on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || points.length === 0) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Use dark/light mode detection for stroke styles
        const isDark = document.documentElement.classList.contains("dark");
        const trackColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.2)";
        const activeColor = isDark ? "#22c55e" : "#3b82f6";

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Helper to mathematically plot the curve
        const plotCurve = (targetProgress: number) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, 0);
            ctx.lineTo(points[0].x, points[0].y);

            let currentPathLength = 0;
            // Rough estimation of path segments for progress coloring
            const totalSegments = points.length - 1;
            const targetSegmentIndex = targetProgress * totalSegments;

            for (let i = 0; i < points.length - 1; i++) {
                if (i > Math.floor(targetSegmentIndex)) break; // Stop drawing if beyond progress

                const p1 = points[i];
                const p2 = points[i + 1];
                
                const isMobile = p1.x < 100;
                const swingAmount = isMobile ? 30 : 60;
                const offset = isMobile ? swingAmount : (i % 2 === 0 ? swingAmount : -swingAmount);

                const cp1x = p1.x + offset;
                const cp1y = p1.y + (p2.y - p1.y) * 0.33;
                const cp2x = p2.x + offset;
                const cp2y = p1.y + (p2.y - p1.y) * 0.66;

                // Mathematical Bezier Curve 
                // B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
                
                // If this is the partial segment, we need to calculate the exact stopping point on the bezier curve
                if (i === Math.floor(targetSegmentIndex) && targetProgress < 1) {
                    const t = targetSegmentIndex - i; // fractional progress through this segment 0.0 to 1.0
                    
                    // Since standard bezierCurveTo can't do partial drawing natively on canvas contexts,
                    // we mathematically calculate multiple points along the curve and lineTo them.
                    const stepCount = 50;
                    const maxSteps = Math.floor(stepCount * t);
                    
                    for (let step = 1; step <= maxSteps; step++) {
                        const ct = step / stepCount;
                        const mt = 1 - ct;
                        // Cubic bezier formula
                        const px = mt*mt*mt*p1.x + 3*mt*mt*ct*cp1x + 3*mt*ct*ct*cp2x + ct*ct*ct*p2.x;
                        const py = mt*mt*mt*p1.y + 3*mt*mt*ct*cp1y + 3*mt*ct*ct*cp2y + ct*ct*ct*p2.y;
                        ctx.lineTo(px, py);
                    }
                    break;
                } else {
                    // Full segment
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }
            }
            
            // Draw end tail if fully completed
            if (targetProgress >= 0.99 && points.length > 0) {
                const lastP = points[points.length - 1];
                ctx.lineTo(lastP.x, lastP.y + 100);
            }
            
            ctx.stroke();
        };

        // 1. Draw the background track (full progress)
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = trackColor;
        ctx.shadowBlur = 0;
        plotCurve(1.0);

        // 2. Mathematically plot the active colored line over top (based on scroll progress)
        ctx.strokeStyle = activeColor;
        ctx.shadowColor = activeColor;
        ctx.shadowBlur = 12; // Glowing drop shadow effect
        plotCurve(scrollProgress);

    }, [points, scrollProgress]);

    const getIcon = (type: string) => {
        switch(type) {
            case "Learn": return <BookOpen className="w-5 h-5" />;
            case "Build": return <Hammer className="w-5 h-5" />;
            case "Certify": return <Award className="w-5 h-5" />;
            case "Apply": return <Briefcase className="w-5 h-5" />;
            default: return <MapPin className="w-5 h-5" />;
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto py-20 px-4 flex flex-col items-center" ref={containerRef}>
            
            {/* HTML Canvas mathematically plotting the Bezier curves */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 pointer-events-none z-0 w-full h-full"
            />

            {/* Timeline Nodes */}
            <div className="relative z-10 w-full flex flex-col gap-12 md:gap-24">
                {timelineNodes.map((node, i) => {
                    const isLeft = i % 2 === 0;

                    return (
                        <motion.div
                            key={node.id}
                            className={cn(
                                "timeline-node flex w-full",
                                isLeft ? "md:justify-start" : "md:justify-end",
                                "justify-start" // Always left-aligned on mobile
                            )}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <div className={cn(
                                "flex items-center w-full md:w-1/2",
                                isLeft ? "md:flex-row flex-row" : "md:flex-row-reverse flex-row"
                            )}>
                                {/* Icon Node */}
                                <div className={cn(
                                    "node-icon shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center z-10 mx-4 md:mx-8 shadow-xl transition-all duration-300",
                                    node.color === "blue" ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300 shadow-blue-500/30" :
                                    node.color === "purple" ? "bg-purple-100 dark:bg-purple-900 border-purple-500 text-purple-600 dark:text-purple-300 shadow-purple-500/30" :
                                    "bg-emerald-100 dark:bg-emerald-900 border-emerald-500 text-emerald-600 dark:text-emerald-300 shadow-emerald-500/30",
                                )}>
                                    {getIcon(node.type)}
                                </div>

                                {/* Card Content */}
                                <div className={cn(
                                    "flex-1 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-2xl p-6 transition-all duration-300",
                                    "hover:scale-[1.02]",
                                    node.color === "blue" ? "hover:shadow-blue-500/20" :
                                    node.color === "purple" ? "hover:shadow-purple-500/20" :
                                    "hover:shadow-emerald-500/20"
                                )}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest",
                                            node.color === "blue" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200" :
                                            node.color === "purple" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200" :
                                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
                                        )}>
                                            {node.phase}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {node.type}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{node.title}</h3>
                                    
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        {node.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
