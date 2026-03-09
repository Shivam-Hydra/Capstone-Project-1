import { Course } from "@/types";
import { BookOpen, Clock, Star, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-slate-800 p-5 rounded-2xl transition-all duration-500 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:border-primary/40 group h-full relative overflow-hidden flex flex-col animate-fade-in">
            {/* Futuristic hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-gradient-to-r from-primary/20 to-primary/5 px-2.5 py-1 rounded-md inline-block mb-3 border border-primary/20 shadow-inner">
                            {course.provider}
                        </span>
                        <h3 className="font-bold text-foreground text-[15px] line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                            {course.title}
                        </h3>
                    </div>
                    <div className="bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-md flex items-center gap-1.5 font-bold ml-3 shrink-0 shadow-inner">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> 
                        {course.rating.toFixed(1)}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-5 font-medium opacity-90">
                    <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-white/10">
                        <BookOpen className="h-3.5 w-3.5 text-primary/80" />
                        <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-white/10">
                        <Clock className="h-3.5 w-3.5 text-primary/80" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-border/50 flex items-center justify-between">
                    <div className="flex gap-2 overflow-hidden">
                        {course.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-muted-foreground border border-border/50 px-2 py-1 rounded-md truncate max-w-[80px]">
                                {tag}
                            </span>
                        ))}
                        {course.tags.length > 2 && (
                            <span className="text-[10px] font-bold bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-muted-foreground border border-border/50 px-2 py-1 rounded-md">
                                +{course.tags.length - 2}
                            </span>
                        )}
                    </div>
                    <Button size="sm" className="h-8 text-[11px] font-bold tracking-wider gap-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg transition-all duration-300 shadow-inner border border-primary/20 hover:border-primary px-3 shadow-primary/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]" asChild>
                        <a href={course.url} target="_blank" rel="noreferrer">
                            View <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
