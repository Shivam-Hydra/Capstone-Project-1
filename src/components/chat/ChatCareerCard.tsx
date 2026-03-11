"use client";

import { Career } from "@/types";
import { Star, IndianRupee, TrendingUp, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChatCareerCardProps {
    career: Career;
    onViewRoadmap?: (id: string) => void;
}

export function ChatCareerCard({ career, onViewRoadmap }: ChatCareerCardProps) {
    // Deterministic curated Unsplash images for careers
    const images = [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    ];
    // Hash to assign a constant image based on career title letters
    const charCodeSum = career.title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bgImage = images[charCodeSum % images.length];

    return (
        <div className="relative h-[480px] w-full max-w-sm rounded-[32px] overflow-hidden group shadow-lg transition-transform duration-300 hover:scale-[1.02] flex flex-col animate-fade-in mx-auto border border-black/5 dark:border-white/5">
            
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />
            
            {/* Heavy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900/10" />
 
            {/* Domain Tag (Top Right) */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-black/10 dark:border-white/20 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-800 dark:text-white">{career.domain}</span>
            </div>

            {/* Content Container */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-10 h-full">
                
                {/* Title */}
                <div className="mb-4 mt-auto">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-2">{career.title}</h3>
                </div>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {/* Match Score Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 backdrop-blur-md border border-blue-200 dark:border-blue-400/30 shadow-sm">
                        <Star className="h-3 w-3 text-blue-500 fill-blue-500 dark:text-blue-400 dark:fill-blue-400" />
                        <span className="text-blue-800 dark:text-blue-100 text-xs font-bold">{career.matchScore}% Match</span>
                    </div>

                    {/* Salary Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
                        <IndianRupee className="h-3 w-3 text-slate-600 dark:text-white/70" />
                        <span className="text-slate-800 dark:text-white text-xs font-semibold">₹{(career.salaryRange.min/100000).toFixed(0)}L - {(career.salaryRange.max/100000).toFixed(0)}L</span>
                    </div>
                    
                    {/* Outlook Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-slate-600 dark:text-white/70" />
                        <span className="text-slate-800 dark:text-white text-xs font-semibold">{career.outlook}</span>
                    </div>
                </div>

                {/* Match Reasons (Tags) */}
                <div className="flex flex-wrap gap-1.5 mb-5 opacity-90 dark:opacity-80">
                    {(career.matchReason || "Matches your profile").split('\n').slice(0, 2).map((reason, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white/80 border border-black/10 dark:border-white/10 px-2 py-1 rounded-md shadow-sm">
                            {reason.replace(/^✓\s*/, '')}
                        </span>
                    ))}
                </div>

                {/* Call to Action Button */}
                <Button 
                    onClick={() => onViewRoadmap?.(career.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 h-12 text-[15px] font-bold rounded-full transition-all duration-300 shadow-xl"
                >
                    View Roadmap <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
