"use client";

import { Career, Course } from "@/types";
import { motion } from "framer-motion";
import { Briefcase, BookOpen, Star, Clock, Trophy, Target, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CurvedRoadmapProps {
    careers: Career[];
    courses: Course[];
}

export function CurvedRoadmap({ careers, courses }: CurvedRoadmapProps) {
    // Combine careers and courses into a unified timeline
    // Alternate them so we get a mix of "Learn this" then "Qualify for this"
    const timelineNodes = [];
    const maxLen = Math.max(careers.length, courses.length);
    for (let i = 0; i < maxLen; i++) {
        if (courses[i]) {
            timelineNodes.push({ type: "course", data: courses[i] });
        }
        if (careers[i]) {
            timelineNodes.push({ type: "career", data: careers[i] });
        }
    }

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<{ x: number, y: number }[]>([]);

    useEffect(() => {
        const updatePoints = () => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const icons = containerRef.current.querySelectorAll('.roadmap-icon');
            
            const newPoints = Array.from(icons).map(icon => {
                const rect = icon.getBoundingClientRect();
                return {
                    x: (rect.left + rect.width / 2) - containerRect.left,
                    y: (rect.top + rect.height / 2) - containerRect.top,
                };
            });
            setPoints(newPoints);
        };

        const timer = setTimeout(updatePoints, 100);
        window.addEventListener('resize', updatePoints);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePoints);
        };
    }, [careers, courses]);

    // Generate precise SVG path connecting the icons
    let pathString = "";
    if (points.length > 0) {
        // Start from top, heading to first node
        pathString = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;
        
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            
            // Adjust wave direction and size based on screen width
            // If p1.x < 100 it means we are on mobile (left aligned)
            const isMobile = p1.x < 100;
            const swingAmount = isMobile ? 30 : 60;
            // On mobile, just swing out to the right; on desktop, alternate.
            const offset = isMobile ? swingAmount : (i % 2 === 0 ? swingAmount : -swingAmount);

            const cp1x = p1.x + offset;
            const cp1y = p1.y + (p2.y - p1.y) * 0.33;
            const cp2x = p2.x + offset;
            const cp2y = p1.y + (p2.y - p1.y) * 0.66;

            pathString += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        
        // End below the last node
        const lastP = points[points.length - 1];
        pathString += ` L ${lastP.x} ${lastP.y + 500}`;
    }

    // Animation variants
    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2.5, ease: "easeInOut" }
        }
    } as any;

    const nodeVariants = {
        hidden: { opacity: 0, scale: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { delay: 0.5 + i * 0.2, type: "spring", stiffness: 100 }
        })
    } as any;

    return (
        <div className="relative w-full max-w-5xl mx-auto py-20 px-4 flex flex-col items-center" ref={containerRef}>
            
            {/* Dynamic SVG Curved Path (Background) */}
            {points.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] dark:drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]">
                        <motion.path
                            d={pathString}
                            fill="transparent"
                            className="stroke-blue-500 dark:stroke-green-500 transition-colors duration-500"
                            strokeWidth="6"   // Bold and elegant
                            strokeLinecap="round"
                            variants={pathVariants}
                            initial="hidden"
                            animate="visible"
                        />
                    </svg>
                </div>
            )}

            {/* Timeline Nodes */}
            <div className="relative z-10 w-full flex flex-col gap-12 md:gap-24">
                {timelineNodes.map((node, i) => {
                    const isLeft = i % 2 === 0;
                    const isCourse = node.type === "course";
                    const data = node.data as any;
                    const stepNumber = (i + 1).toString().padStart(2, '0');

                    return (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={nodeVariants}
                            initial="hidden"
                            animate="visible"
                            className={cn(
                                "flex w-full items-center relative",
                                isLeft ? "md:justify-start" : "md:justify-end",
                                "justify-start pl-16 md:pl-0"
                            )}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* 6. STEP LABELS */}
                            <div className={cn(
                                "absolute -top-8 left-20 md:left-auto md:right-auto font-black italic tracking-[0.3em] text-[10px] opacity-60 uppercase !text-white",
                                isLeft ? "md:left-8" : "md:right-8"
                            )}>
                                STEP {stepNumber} <span className="text-white/50 truncate ml-2">/ {isCourse ? "Course" : "Career"}</span>
                            </div>

                            {/* Node Bubble on the path */}
                            <div className={cn(
                                "roadmap-icon absolute md:left-1/2 md:-translate-x-1/2 left-8 -translate-x-1/2",
                                "w-4 h-4 rounded-full border-[3px] bg-background shadow-lg z-20 transition-transform duration-300",
                                isCourse ? "border-purple-500 shadow-purple-500/20" : "border-blue-500 shadow-blue-500/20",
                                hoveredIndex === i && "scale-150"
                            )} />

                            {/* 7. ROADMAP CARD DEPTH & 4/5. REDESIGNED CARDS */}
                            <div className={cn(
                                "relative w-full md:w-[48%] border-white/5 backdrop-blur-xl rounded-[48px] pt-16 pb-10 px-10 border transition-all duration-500 text-white flex flex-col group",
                                isCourse 
                                    ? "bg-gradient-to-b from-[#0b1220] to-[#0a0f1c] shadow-[0_25px_60px_rgba(0,0,0,0.35)] active:shadow-purple-500/10" 
                                    : "bg-gradient-to-b from-[#0b1220] to-[#0a0f1c] shadow-[0_25px_60px_rgba(0,0,0,0.35)] active:shadow-blue-500/10",
                                hoveredIndex === i ? (isCourse ? "scale-[1.03] shadow-purple-500/25 border-purple-500/20" : "scale-[1.03] shadow-blue-500/30 border-blue-500/20") : ""
                            )}>
                                {/* Overflowing Top Anchor Icon with Learning/Career Theme */}
                                <div className={cn(
                                    "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-[32px] border-4 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6",
                                    isCourse 
                                        ? "bg-purple-600/90 border-[#1a1c2e] text-white shadow-purple-900/40" 
                                        : "bg-blue-600/90 border-[#1a1c2e] text-white shadow-blue-900/40"
                                )}>
                                    {isCourse ? <BookOpen className="w-9 h-9" /> : <Briefcase className="w-9 h-9" />}
                                </div>

                                <div className="text-center space-y-4">
                                    <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
                                        <span className={cn(
                                            "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border",
                                            isCourse 
                                                ? "bg-purple-500/10 text-purple-400 border-purple-400/20" 
                                                : "bg-blue-500/10 text-blue-400 border-blue-400/20"
                                        )}>
                                            {isCourse ? "AI Course Recommendation" : "CAREER PATH"}
                                        </span>
                                        {isCourse && data.level && (
                                            <span className="text-[10px] bg-white/5 text-slate-400 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-white/5">
                                                {data.level}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-3xl font-black !text-white leading-none tracking-tighter uppercase italic force-text-contrast">{data.title}</h3>
                                    
                                    {isCourse ? (
                                        <>
                                            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                                                <div className="flex items-center gap-1.5 text-slate-200">
                                                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> {data.provider}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-200">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {data.rating || "4.9"} rating
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-200">
                                                    <Clock className="w-3.5 h-3.5 text-blue-400" /> {data.duration}
                                                </div>
                                            </div>

                                            {/* Skill Gain Section */}
                                            <div className="space-y-4 pt-6 border-t border-white/5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Skills you&apos;ll gain</p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {(data.skillsCovered || data.tags || ["Python", "Neural Networks", "TensorFlow"]).slice(0, 3).map((skill: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1.5 rounded-xl uppercase tracking-tight">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-10">
                                                <a 
                                                    href={data.url} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className={cn(
                                                        "group h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 px-8",
                                                        "bg-purple-600 text-white hover:bg-purple-500 shadow-xl shadow-purple-900/20"
                                                    )}
                                                >
                                                    Explore Course
                                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm mx-auto mb-8 line-clamp-2">
                                                {data.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Salary Range</p>
                                                    <p className="font-bold !text-white text-base">
                                                        {data.salaryRange ? `₹${data.salaryRange.min/100000}L – ₹${data.salaryRange.max/100000}L` : data.salary || "₹18L – ₹32L"}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Market Demand</p>
                                                    <p className="font-bold text-emerald-400 text-base flex items-center justify-center gap-1">
                                                        🔥 {data.growth || "High"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Why this fits section */}
                                            <div className="space-y-4 pt-6 border-t border-white/5 text-left">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 text-center">Why this fits you</p>
                                                <ul className="space-y-3">
                                                    {[
                                                        "Programming interest",
                                                        "AI domain preference",
                                                        "Strong logical reasoning"
                                                    ].map((point, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-200 uppercase tracking-tight">
                                                            <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                <Star className="h-2.5 w-2.5 text-blue-400 fill-blue-400" />
                                                            </div>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="pt-10">
                                                <Link href={`/roadmap/${data.id}`} className="w-full">
                                                    <button 
                                                        className={cn(
                                                            "group w-full h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all duration-500 active:scale-95 px-8",
                                                            "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-xl shadow-blue-900/30 hover:shadow-blue-500/40"
                                                        )}
                                                    >
                                                        View Career Roadmap
                                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
