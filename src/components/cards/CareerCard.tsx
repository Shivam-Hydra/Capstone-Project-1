"use client";

import { Career } from "@/types";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Bookmark, BookmarkCheck, MapPin } from "lucide-react";
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

    return (
        <TiltCard rotationFactor={8} className="w-full max-w-sm">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-slate-800 p-5 rounded-2xl transition-all duration-500 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:border-primary/40 group h-full relative overflow-hidden">
                {/* Futuristic Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">{career.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">{career.domain}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {career.matchScore && (
                                <div className="flex items-center gap-1 bg-gradient-to-br from-primary/20 to-primary/5 px-2.5 py-1 rounded-md border border-primary/20 shadow-inner">
                                    <span className="text-xs font-black text-primary">{career.matchScore}%</span>
                                    <span className="text-[10px] text-primary/80 font-bold uppercase tracking-wider">Match</span>
                                </div>
                            )}
                            <button
                                onClick={handleBookmark}
                                disabled={bookmarking}
                                title={isSaved ? "Remove from saved" : "Save career"}
                                className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-border transition-all duration-300"
                            >
                                {isSaved
                                    ? <BookmarkCheck className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    : <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                }
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed opacity-90">
                        {career.description}
                    </p>

                    {career.matchReason && (
                        <p className="text-[11px] text-primary/90 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5 mb-4 leading-relaxed backdrop-blur-sm shadow-inner">
                            <span className="opacity-70 mr-1">✦</span> {career.matchReason}
                        </p>
                    )}

                    <div className="border-t border-border/50 pt-4 mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold opacity-80">Salary</p>
                            <p className="text-xs font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {(career.salaryRange.min / 100000).toFixed(1)}L – {(career.salaryRange.max / 100000).toFixed(1)}L
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold opacity-80">Growth</p>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ring-2 shadow-sm ${career.outlook === "Growing" ? "bg-emerald-500 ring-emerald-500/30 shadow-emerald-500/50" : career.outlook === "Stable" ? "bg-amber-500 ring-amber-500/30 shadow-amber-500/50" : "bg-red-400 ring-red-400/30 shadow-red-400/50"}`} />
                                <p className="text-xs font-bold text-foreground">{career.outlook}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-5">
                        <Button
                            onClick={() => onViewRoadmap(career.id)}
                            className="flex-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-foreground hover:bg-primary hover:text-white border border-border/50 hover:border-primary border-b-border border-b-2 hover:border-b-primary hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] h-9 text-xs font-bold rounded-xl transition-all duration-300"
                        >
                            View Roadmap
                        </Button>
                        <Link href={`/roadmap/${career.id}`} tabIndex={-1}>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-border/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300" title="Full page roadmap">
                                <MapPin className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </TiltCard>
    );
}
