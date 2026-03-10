"use client";

import { Career } from "@/types";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Bookmark, BookmarkCheck, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/store";
import { saveCareerToFirestore, removeCareerFromFirestore } from "@/lib/user-service";
import { useState } from "react";

interface CareerCardProps {
    career: Career;
    onViewRoadmap: (careerId: string) => void;
    isSaved?: boolean;
}

export function CareerCard({ career, onViewRoadmap, isSaved = false }: CareerCardProps) {
    const { user } = useAuth();
    const { saveCareer, removeCareer } = useUserStore();
    const [bookmarking, setBookmarking] = useState(false);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user) return;
        setBookmarking(true);
        if (isSaved) {
            removeCareer(career.id);
            await removeCareerFromFirestore(user.uid, career.id);
        } else {
            saveCareer(career);
            await saveCareerToFirestore(user.uid, { id: career.id, title: career.title, domain: career.domain });
        }
        setBookmarking(false);
    };

    // Deterministic curated Unsplash images for varying abstract tech/modern environments
    const images = [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    ];
    // Simple hash to consistently pick the same image for the same career ID
    const charCodeSum = career.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bgImage = images[charCodeSum % images.length];

    return (
        <TiltCard rotationFactor={5} className="w-full max-w-sm h-full">
            <div className="relative h-[480px] w-full rounded-[32px] overflow-hidden group shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                />
                
                {/* Heavy Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/10" />

                {/* Bookmark Icon */}
                <button
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                    {isSaved
                        ? <BookmarkCheck className="h-5 w-5 text-white drop-shadow-md" />
                        : <Bookmark className="h-5 w-5 text-white/90 hover:text-white transition-colors" />
                    }
                </button>

                {/* Content Container positioned at the bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-10 h-full">
                    
                    {/* Titles */}
                    <div className="mb-3 mt-auto">
                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{career.title}</h3>
                        <p className="text-sm text-white/70 mt-1 font-medium tracking-wide">{career.domain}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/80 line-clamp-3 leading-relaxed mb-4">
                        {career.description}
                    </p>

                    {/* Glassmorphic Pills Container */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {/* Salary Pill */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-white text-xs font-semibold">₹{(career.salaryRange.min / 100000).toFixed(1)}L - ${(career.salaryRange.max / 100000).toFixed(1)}L</span>
                        </div>
                        
                        {/* Growth Pill */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                            <Star className={`h-3 w-3 ${career.outlook === "Growing" ? "text-emerald-400 fill-emerald-400" : career.outlook === "Stable" ? "text-amber-400 fill-amber-400" : "text-blue-400 fill-blue-400"}`} />
                            <span className="text-white text-xs font-semibold">{career.outlook}</span>
                        </div>

                        {/* Match Score Pill */}
                        {career.matchScore && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30">
                                <span className="text-blue-200 text-xs font-bold">{career.matchScore}% Match</span>
                            </div>
                        )}
                    </div>

                    {/* Match Reason (Only if exists) */}
                    {career.matchReason && (
                        <p className="text-[12px] text-white/70 italic line-clamp-2 mb-4 px-1">
                            {career.matchReason}
                        </p>
                    )}

                    {/* Call to Action Button */}
                    <Link href={`/roadmap/${career.id}`} className="w-full mt-auto">
                        <Button
                            className="w-full bg-white hover:bg-slate-100 text-slate-900 h-12 text-[15px] font-bold rounded-full transition-all duration-300 shadow-xl"
                        >
                            View Roadmap
                        </Button>
                    </Link>
                </div>
            </div>
        </TiltCard>
    );
}
