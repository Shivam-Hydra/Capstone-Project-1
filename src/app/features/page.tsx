import { Metadata } from "next";
import { Sparkles, BrainCircuit, Map, BookOpen, Shield, LineChart, Zap, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Features — CareerAI",
    description: "Explore CareerAI's powerful features: AI-powered career guidance, personalized roadmaps, course recommendations, and more.",
};

const features = [
    {
        icon: BrainCircuit,
        title: "AI Career Counsellor",
        description: "Chat with Gemini-powered AI that understands your background and gives specific, actionable career advice — not generic tips.",
        color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        icon: Map,
        title: "Personalized Roadmaps",
        description: "Get step-by-step career roadmaps broken into short, mid, and long-term phases. Track your progress and mark steps complete.",
        color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
        icon: BookOpen,
        title: "Course Recommendations",
        description: "AI curates the best free and paid courses from Coursera, NPTEL, YouTube — matched to your skill gaps.",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
        icon: LineChart,
        title: "Career Match Scores",
        description: "See how well each career aligns with your profile. Every recommendation includes a percentage match and reason.",
        color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Firebase Auth protects your account. Your profile and data are secured in Firestore and never shared.",
        color: "bg-red-50 text-red-600 border-red-100",
    },
    {
        icon: Zap,
        title: "Instant Analysis",
        description: "Describe yourself in plain text. AI extracts your education, skills, and interests to generate a profile in seconds.",
        color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    },
    {
        icon: Users,
        title: "India-Focused Guidance",
        description: "Salary ranges in INR, NPTEL recommendations, Indian job market context — built specifically for Indian students.",
        color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
        icon: Sparkles,
        title: "Always Up-to-Date",
        description: "Powered by Gemini 1.5 Flash — our AI recommendations stay current with the latest industry trends.",
        color: "bg-pink-50 text-pink-600 border-pink-100",
    },
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-blue-50/60 to-background">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 mb-6">
                    <Sparkles className="h-3.5 w-3.5" /> Everything You Need
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-3xl mx-auto leading-tight">
                    The Complete Career Guidance Platform
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                    From first-time job seekers to career changers — CareerAI gives every student the tools to make confident career decisions.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg active:scale-95">
                        Get Started Free
                    </Link>
                    <Link href="/explore" className="border border-border text-foreground px-6 py-3 rounded-full font-semibold hover:bg-secondary transition-all">
                        Explore Careers
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border mb-4 ${feature.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 px-4 bg-blue-600 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to map your career?</h2>
                <p className="text-blue-100 mb-8 max-w-xl mx-auto">Create your free account and get personalized career guidance in under 2 minutes.</p>
                <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95 inline-block">
                    Start for Free →
                </Link>
            </section>
        </main>
    );
}
