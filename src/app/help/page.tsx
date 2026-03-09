import { Metadata } from "next";
import { HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Help & FAQ — CareerAI",
    description: "Answers to the most common questions about CareerAI — accounts, AI chat, roadmaps, and more.",
};

const faqs = [
    {
        category: "Getting Started",
        items: [
            {
                q: "Is CareerAI free to use?",
                a: "Yes! CareerAI is free for all students. You get AI chat, career exploration, roadmaps, and course recommendations at no cost. A Pro plan with unlimited usage is coming soon.",
            },
            {
                q: "Do I need to create an account?",
                a: "Yes. An account is required to use features like the AI chat, roadmap tracking, and career saves. You can sign up with your email or Google account in under a minute.",
            },
            {
                q: "How do I set up my profile?",
                a: "After signing up, you'll be prompted to create your profile. You can either type about yourself freely or fill in a structured form with your education level, degree, and stream. You can also add skills and interests later from the Profile page.",
            },
        ],
    },
    {
        category: "AI Chat",
        items: [
            {
                q: "How does the AI career chat work?",
                a: "The chat is powered by Google Gemini 1.5 Flash. It knows your profile and gives personalized career advice, roadmaps, salary info, and course recommendations based on your background.",
            },
            {
                q: "Why isn't the AI responding?",
                a: "Make sure you're logged in and that the dev server is running with a valid Gemini API key. If you see an error about the API key, check that GEMINI_API_KEY is set in .env.local.",
            },
            {
                q: "Can the AI suggest specific college courses or exams?",
                a: "Yes! Ask it directly. For example: 'What certifications should I do for a data science career?' or 'Should I pursue GATE after B.Tech?'",
            },
        ],
    },
    {
        category: "Careers & Roadmaps",
        items: [
            {
                q: "How is the career match score calculated?",
                a: "The AI analyzes your education, skills, and interests and scores each career based on how well your profile aligns with the typical requirements for that role.",
            },
            {
                q: "Can I save careers and come back later?",
                a: "Yes. Click the bookmark icon on any career card to save it. Your saved careers are stored in Firestore linked to your account and are visible on your Profile page.",
            },
            {
                q: "How do I mark roadmap steps as complete?",
                a: "On any roadmap page, click the circle button next to a step to cycle through Pending → In Progress → Completed. Your progress is saved automatically.",
            },
        ],
    },
    {
        category: "Courses",
        items: [
            {
                q: "Are the recommended courses free?",
                a: "The AI prioritizes free resources — especially NPTEL, YouTube, and Coursera audit mode. Use the 'Free' filter on the Courses page to see only no-cost options.",
            },
            {
                q: "Where do the course links go?",
                a: "Links open on the original platform (Coursera, Udemy, NPTEL, etc.) in a new tab. CareerAI does not host any course content.",
            },
        ],
    },
    {
        category: "Account & Privacy",
        items: [
            {
                q: "How do I change my name or skills?",
                a: "Go to your Profile page (/profile) while logged in. You can edit your name, skills, and interests, then click Save Changes.",
            },
            {
                q: "Who can see my profile data?",
                a: "Only you. Your Firestore document is protected by security rules that only allow your own account to read or write your data.",
            },
            {
                q: "How do I delete my account?",
                a: "Account deletion is not yet available through the app UI. Email us at support@careerai.app and we'll delete your account and data within 7 days.",
            },
        ],
    },
];

export default function HelpPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-12 px-4 text-center bg-gradient-to-b from-blue-50/60 to-background">
                <div className="h-14 w-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="h-7 w-7 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Help & FAQ</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Can't find what you're looking for? Email us at{" "}
                    <a href="mailto:support@careerai.app" className="text-primary underline underline-offset-4">support@careerai.app</a>
                </p>
            </section>

            {/* FAQ */}
            <section className="py-12 px-4 container mx-auto max-w-3xl space-y-10">
                {faqs.map((section) => (
                    <div key={section.category}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                            <span className="w-6 h-px bg-border inline-block" />
                            {section.category}
                        </h2>
                        <div className="space-y-3">
                            {section.items.map((item) => (
                                <details key={item.q} className="group bg-card border border-border rounded-xl p-5 cursor-pointer">
                                    <summary className="flex items-center justify-between text-sm font-semibold text-foreground list-none">
                                        {item.q}
                                        <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-4" />
                                    </summary>
                                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Contact strip */}
                <div className="p-6 bg-secondary/30 rounded-xl border border-border text-center">
                    <p className="text-sm font-semibold text-foreground mb-1">Still need help?</p>
                    <p className="text-xs text-muted-foreground mb-4">We usually respond within 24 hours on working days.</p>
                    <a href="mailto:support@careerai.app" className="text-sm font-bold text-primary underline underline-offset-4">
                        📧 support@careerai.app
                    </a>
                </div>
            </section>
        </main>
    );
}
