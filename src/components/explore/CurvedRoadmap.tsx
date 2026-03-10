"use client";

import { Career, Course } from "@/types";
import { motion } from "framer-motion";
import { Briefcase, BookOpen, Star, Clock, Trophy, Target } from "lucide-react";
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
                            {/* Node Bubble on the path */}
                            <div className={cn(
                                "roadmap-icon absolute md:left-1/2 md:-translate-x-1/2 left-8 -translate-x-1/2",
                                "w-4 h-4 rounded-full border-[3px] bg-background shadow-lg z-20 transition-transform duration-300",
                                isCourse ? "border-purple-500" : "border-blue-500",
                                hoveredIndex === i && "scale-150"
                            )} />

                            {/* Card Content - Redesigned */}
                            <div className={cn(
                                "relative w-full md:w-[45%] bg-slate-900 border-slate-800 shadow-2xl rounded-[32px] pt-14 pb-8 px-8 border transition-all duration-300 text-white flex flex-col items-center text-center dark:bg-white dark:border-slate-200 dark:shadow-md dark:text-slate-900",
                                hoveredIndex === i ? (isCourse ? "scale-[1.02] shadow-purple-500/30 dark:shadow-purple-500/20" : "scale-[1.02] shadow-blue-500/30 dark:shadow-blue-500/20") : ""
                            )}>
                                {/* Overflowing Top Anchor Icon */}
                                <div className={cn(
                                    "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-2xl shadow-black/50 border-background backdrop-blur-xl",
                                    isCourse ? "bg-purple-600/90 text-white" : "bg-blue-600/90 text-white"
                                )}>
                                    {isCourse ? <BookOpen className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
                                </div>

                                <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                                    <span className={cn(
                                        "text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest",
                                        isCourse ? "bg-purple-900/80 text-purple-200 dark:bg-purple-100 dark:text-purple-700" : "bg-blue-900/80 text-blue-200 dark:bg-blue-100 dark:text-blue-700"
                                    )}>
                                        {isCourse ? "Course Recommendation" : "Career Path"}
                                    </span>
                                    {isCourse && data.level && (
                                        <span className="text-[10px] bg-slate-700/80 text-slate-200 dark:bg-slate-100 dark:text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                                            {data.level}
                                        </span>
                                    )}
                                    {!isCourse && data.matchScore && (
                                        <span className="text-[10px] bg-emerald-900/80 text-emerald-300 dark:bg-emerald-100 dark:text-emerald-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Target className="w-3 h-3" /> {data.matchScore}% Match
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white dark:text-slate-900 mb-4 leading-tight tracking-tight">{data.title}</h3>
                                
                                {isCourse ? (
                                    <>
                                        {data.description && <p className="text-sm text-slate-300 dark:text-slate-600 mb-6 leading-relaxed px-2">{data.description}</p>}
                                        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-slate-400 dark:text-slate-500 mb-8 border-t border-slate-700/50 dark:border-slate-200 w-full pt-4">
                                            <div className="flex items-center gap-1.5 font-medium text-slate-200 dark:text-slate-800">
                                                <Trophy className="w-4 h-4 text-amber-500" /> {data.provider}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> {data.rating || "4.5"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {data.duration}
                                            </div>
                                        </div>
                                        <a 
                                            href={(data as Course).url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className={cn(
                                                "w-full max-w-[200px] h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg",
                                                "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-purple-500/25"
                                            )}
                                        >
                                            View Course
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-300 dark:text-slate-600 mb-6 px-2">{data.description}</p>
                                        <div className="flex justify-center items-center gap-8 text-sm mb-8 bg-slate-800/50 dark:bg-slate-100/50 w-full py-4 rounded-2xl">
                                            <div className="flex flex-col items-center">
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Salary Range</p>
                                                <p className="font-bold text-slate-200 dark:text-slate-800">{data.salary}</p>
                                            </div>
                                            <div className="h-10 w-px bg-slate-700 dark:bg-slate-300"></div>
                                            <div className="flex flex-col items-center">
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Demand</p>
                                                <p className="font-bold text-emerald-400 dark:text-emerald-600 flex items-center gap-1">
                                                    {data.growth} <span className="text-[10px]">🔥</span>
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/roadmap/${data.id}`} className="w-full flex justify-center">
                                            <button 
                                                className={cn(
                                                    "w-full max-w-[200px] h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg mt-auto",
                                                    "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-blue-500/25"
                                                )}
                                            >
                                                View Roadmap
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
