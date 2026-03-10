import { Course } from "@/types";
import { BookOpen, Clock, Star, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    // Deterministic curated Unsplash images for courses
    const images = [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    ];
    // Hash to assign a constant image based on course title letters
    const charCodeSum = course.title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bgImage = images[charCodeSum % images.length];

    return (
        <div className="relative h-[480px] w-full max-w-sm rounded-[32px] overflow-hidden group shadow-lg transition-transform duration-300 hover:scale-[1.02] flex flex-col animate-fade-in mx-auto">
            
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />
            
            {/* Heavy Gradient Overlay: White in light mode, Black in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900/10" />

            {/* Platform Tag (Top Right) */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-black/10 dark:border-white/20 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-800 dark:text-white">{course.provider}</span>
            </div>

            {/* Content Container positioned at the bottom */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-10 h-full">
                
                {/* Title and Short Description */}
                <div className="mb-4 mt-auto">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-2">{course.title}</h3>
                </div>

                {/* Glassmorphic Pills Container */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {/* Rating Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 backdrop-blur-md border border-amber-200 dark:border-amber-400/30 shadow-sm">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />
                        <span className="text-amber-800 dark:text-amber-100 text-xs font-bold">{course.rating.toFixed(1)}</span>
                    </div>

                    {/* Level Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
                        <BookOpen className="h-3.5 w-3.5 text-slate-600 dark:text-white/70" />
                        <span className="text-slate-800 dark:text-white text-xs font-semibold">{course.level}</span>
                    </div>
                    
                    {/* Duration Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
                        <Clock className="h-3.5 w-3.5 text-slate-600 dark:text-white/70" />
                        <span className="text-slate-800 dark:text-white text-xs font-semibold">{course.duration}</span>
                    </div>
                </div>

                {/* Tags section (optional, keeping it minimal like the reference to avoid clutter) */}
                <div className="flex flex-wrap gap-1.5 mb-5 opacity-90 dark:opacity-80">
                    {course.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white/80 border border-black/10 dark:border-white/10 px-2 py-1 rounded-md shadow-sm">
                            {tag}
                        </span>
                    ))}
                    {course.tags.length > 3 && (
                        <span className="text-[10px] font-bold bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white/80 border border-black/10 dark:border-white/10 px-2 py-1 rounded-md shadow-sm">
                            +{course.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Call to Action Button */}
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 h-12 text-[15px] font-bold rounded-full transition-all duration-300 shadow-xl" asChild>
                    <a href={course.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                        View Course <ExternalLink className="h-4 w-4" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
