"use client";

import { useEffect, useState } from "react";
import { Course } from "@/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useUserStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
    Loader2, ExternalLink, Star, Clock, BookOpen,
    GraduationCap, Tv, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const LEVEL_COLORS = {
    Beginner: "bg-green-100 text-green-700 border-green-200",
    Intermediate: "bg-amber-100 text-amber-700 border-amber-200",
    Advanced: "bg-red-100 text-red-700 border-red-200",
};

const PROVIDER_ICONS: Record<string, string> = {
    coursera: "🎓", udemy: "🟣", youtube: "📺", nptel: "🇮🇳",
    edx: "📘", udacity: "🔶", linkedin: "💼", default: "📚",
};

function getProviderIcon(provider: string): string {
    const key = provider.toLowerCase();
    for (const [k, v] of Object.entries(PROVIDER_ICONS)) {
        if (key.includes(k)) return v;
    }
    return PROVIDER_ICONS.default;
}

type FilterLevel = "All" | "Beginner" | "Intermediate" | "Advanced";
type FilterPrice = "All" | "Free" | "Paid";

export default function CoursesPage() {
    const { profile } = useUserStore();
    const { user } = useAuth();
    const [courses, setCourses] = useState<(Course & { price?: string; description?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterLevel, setFilterLevel] = useState<FilterLevel>("All");
    const [filterPrice, setFilterPrice] = useState<FilterPrice>("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) {
                    setError("Please log in to see course recommendations.");
                    setLoading(false);
                    return;
                }

                const res = await fetch("/api/courses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userProfile: profile }),
                });

                if (res.status === 429) {
                    setError("Too many requests. Please wait a moment and try again.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                if (data.courses?.length > 0) {
                    setCourses(data.courses);
                } else {
                    setError("Could not load courses. Please try again.");
                }
            } catch {
                setError("Connection error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [profile, user]);

    const filtered = courses.filter((c) => {
        if (filterLevel !== "All" && c.level !== filterLevel) return false;
        if (filterPrice === "Free" && c.price === "Paid") return false;
        if (filterPrice === "Paid" && c.price === "Free") return false;
        if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !c.provider.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !(c.skillsCovered || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
        return true;
    });

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 animate-fade-in">
                {/* Header */}
                <div className="text-center space-y-3 mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 mb-2">
                        <BookOpen className="h-3.5 w-3.5" /> AI-Recommended
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Course Recommendations</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {profile
                            ? "Personalized courses based on your profile. Prioritizing free resources from NPTEL, YouTube & Coursera."
                            : "Complete your profile for personalized recommendations."}
                    </p>
                </div>

                {/* Filters */}
                {!loading && courses.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Filter className="h-3.5 w-3.5" /> Filter:
                        </div>

                        {/* Search */}
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-48"
                        />

                        {/* Level filter */}
                        <div className="flex gap-1.5">
                            {(["All", "Beginner", "Intermediate", "Advanced"] as FilterLevel[]).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                                        filterLevel === level
                                            ? "bg-primary text-white border-primary"
                                            : "border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* Price filter */}
                        <div className="flex gap-1.5">
                            {(["All", "Free", "Paid"] as FilterPrice[]).map(price => (
                                <button
                                    key={price}
                                    onClick={() => setFilterPrice(price)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                                        filterPrice === price
                                            ? "bg-primary text-white border-primary"
                                            : "border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {price}
                                </button>
                            ))}
                        </div>

                        <span className="ml-auto text-xs text-muted-foreground">
                            {filtered.length} of {courses.length} courses
                        </span>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm">Generating personalized course recommendations...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <p className="text-muted-foreground text-sm">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline" size="sm">Try Again</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((course) => (
                            <div
                                key={course.id}
                                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col"
                            >
                                {/* Provider + Price */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getProviderIcon(course.provider)}</span>
                                        <span className="text-xs font-semibold text-muted-foreground">{course.provider}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                        (course as any).price === "Free" || (course as any).price === "Free Audit"
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                    )}>
                                        {(course as any).price || "Free"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
                                    {course.title}
                                </h3>

                                {/* Description */}
                                {(course as any).description && (
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                        {(course as any).description}
                                    </p>
                                )}

                                {/* Meta */}
                                <div className="flex items-center gap-3 mb-3 mt-auto pt-3 border-t border-border">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        <span className="font-semibold">{course.rating?.toFixed(1) || "4.5"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <span className={cn(
                                        "ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                                        LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner
                                    )}>
                                        {course.level}
                                    </span>
                                </div>

                                {/* Skills */}
                                {course.skillsCovered?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {course.skillsCovered.slice(0, 3).map(skill => (
                                            <span key={skill} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* CTA */}
                                <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button className="w-full h-9 text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-lg transition-all gap-2 group-hover:bg-primary group-hover:text-white">
                                        View Course <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
