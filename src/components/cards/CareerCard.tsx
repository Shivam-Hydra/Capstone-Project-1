"use client";

import { Career } from "@/types";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/store";
import { saveCareerToFirestore, removeCareerFromFirestore } from "@/lib/user-service";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CareerCardProps {
    career: Career;
    isSaved?: boolean;
}

export function CareerCard({ career, isSaved = false }: CareerCardProps) {
    const { user } = useAuth();
    const { saveCareer, removeCareer } = useUserStore();
    const [bookmarking, setBookmarking] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const images = [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    ];
    const charCodeSum = career.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bgImage = images[charCodeSum % images.length];

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="w-full md:w-[420px] shrink-0 group relative"
        >
            <div className="relative h-[580px] w-full rounded-[40px] overflow-hidden bg-[#1E293B] border border-white/10 shadow-2xl transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.3)]">
                {/* Image Header */}
                <div className="h-48 w-full relative overflow-hidden">
                    <motion.div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                        animate={{ 
                            scale: isHovered ? 1.1 : 1,
                            filter: isHovered ? "blur(4px)" : "blur(0px)" 
                        }}
                        transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/30" />
                    
                    {/* Domain Tag */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-widest text-white uppercase">
                        {career.domain}
                    </div>

                    {/* Bookmark */}
                    <button
                        onClick={handleBookmark}
                        disabled={bookmarking}
                        className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-xl"
                    >
                        {isSaved
                            ? <BookmarkCheck className="h-4 w-4 text-blue-400" />
                            : <Bookmark className="h-4 w-4 text-white" />
                        }
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6 space-y-6">
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">{career.title}</h3>
                        <div className="flex items-center gap-4 text-slate-300 text-sm font-bold">
                            <span className="flex items-center gap-1.5">
                                <span className="text-blue-400">💰</span> ₹{(career.salaryRange.min / 100000).toFixed(0)}L - {(career.salaryRange.max / 100000).toFixed(0)}L
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" /> {career.outlook} Field
                            </span>
                        </div>
                    </div>

                    {/* Match Indicator */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">AI Match Indicator</span>
                            <span className="text-xl font-black text-white">{career.matchScore}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${career.matchScore}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            />
                        </div>
                    </div>

                    {/* Why this matches you */}
                    <div className="space-y-3 bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Why This Fits You</div>
                        <div className="space-y-2">
                            {(career.matchReason || "✓ Matches your skills & interests").split('\n').map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-300">
                                    <span className="text-blue-500">✓</span>
                                    <span>{reason.replace(/^✓\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hover Reveal Content */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-6 inset-x-8 space-y-4 bg-[#1E293B] z-30 pt-4"
                            >
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Key Skills</div>
                                    <div className="flex flex-wrap gap-2">
                                        {career.requiredSkills.slice(0, 4).map((skill, i) => (
                                            <span key={i} className="px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] font-black text-white">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link href={`/roadmap/${career.id}`} className="block">
                                    <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] group">
                                        View Career Roadmap
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
