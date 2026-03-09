import { Metadata } from "next";
import { BookOpen, ChevronRight, Sparkles, User, Map, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Guides — CareerAI",
    description: "Step-by-step guides on how to use CareerAI to discover careers, build your profile, and plan your future.",
};

const guides = [
    {
        icon: User,
        title: "How to Set Up Your Profile",
        description: "Create a complete profile so CareerAI can give you the most personalized recommendations.",
        steps: [
            "Sign up with email or Google",
            "Click 'Build Your Profile' after signing up",
            "Either type about yourself in free text, or fill in the structured form",
            "Your education, degree, and stream will be saved to your profile",
            "Visit /profile at any time to add skills and interests",
        ],
        color: "text-blue-600 bg-blue-50 border-blue-100",
        href: "/profile/create",
        cta: "Create Profile",
    },
    {
        icon: MessageSquare,
        title: "Getting the Best from the AI Chat",
        description: "Learn how to ask questions to get the most useful career advice from CareerAI.",
        steps: [
            "Log in and go to the Chat page",
            "Start by telling the AI your background: degree, year, interests",
            "Ask specific questions like 'What skills should I learn for data science?'",
            "Ask for roadmaps: 'Give me a 6-month plan to become a product manager'",
            "Ask about salary: 'What is the salary for a frontend developer in Bangalore?'",
        ],
        color: "text-purple-600 bg-purple-50 border-purple-100",
        href: "/chat",
        cta: "Open Chat",
    },
    {
        icon: Sparkles,
        title: "Exploring and Saving Careers",
        description: "Use the Explore page to discover AI-matched career paths and save your favourites.",
        steps: [
            "Go to the Explore page from the navbar",
            "If you have a profile, careers will be ranked by AI match score",
            "Click the bookmark icon on any career card to save it",
            "Click 'View Roadmap' to see the learning path for a career",
            "Your saved careers appear in your Profile page",
        ],
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        href: "/explore",
        cta: "Explore Careers",
    },
    {
        icon: Map,
        title: "Tracking Your Roadmap Progress",
        description: "Use interactive roadmaps to track what you've learned step by step.",
        steps: [
            "Open any career from Explore and click 'View Roadmap'",
            "Each roadmap has 3 phases: Foundation, Growth, and Mastery",
            "Click the circle next to any step to mark it In Progress",
            "Click again to mark it Completed — it turns green",
            "Your progress is automatically saved and synced across devices",
        ],
        color: "text-amber-600 bg-amber-50 border-amber-100",
        href: "/explore",
        cta: "Try a Roadmap",
    },
    {
        icon: BookOpen,
        title: "Finding Courses for Your Goals",
        description: "Discover personalized course recommendations from top platforms.",
        steps: [
            "Go to the Courses page from the navbar",
            "AI generates 8 courses tailored to your profile",
            "Use the level filter to find Beginner, Intermediate, or Advanced courses",
            "Use the price filter to find free courses (NPTEL, YouTube, Coursera audit)",
            "Click 'View Course' to open the course on the original platform",
        ],
        color: "text-pink-600 bg-pink-50 border-pink-100",
        href: "/courses",
        cta: "Browse Courses",
    },
];

export default function GuidesPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-12 px-4 text-center bg-gradient-to-b from-blue-50/60 to-background">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How-To Guides</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Get the most out of CareerAI with these step-by-step guides.
                </p>
            </section>

            {/* Guides */}
            <section className="py-12 px-4 container mx-auto max-w-4xl space-y-8">
                {guides.map((guide, i) => {
                    const Icon = guide.icon;
                    return (
                        <div key={guide.title} className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="p-6 flex items-start gap-5">
                                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${guide.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Guide {i + 1}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground mb-1">{guide.title}</h2>
                                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                                </div>
                            </div>

                            <div className="border-t border-border p-6 bg-secondary/20 space-y-3">
                                {guide.steps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
                                    </div>
                                ))}
                                <div className="pt-4">
                                    <Link href={guide.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                                        {guide.cta} <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}
