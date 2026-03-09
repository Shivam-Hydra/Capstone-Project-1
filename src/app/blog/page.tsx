import { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog — CareerAI",
    description: "Career advice, industry insights, and guidance for Indian students from the CareerAI team.",
};

const articles = [
    {
        slug: "top-careers-cs-2025",
        title: "Top 10 Career Paths for Computer Science Graduates in 2025",
        excerpt: "From AI/ML to DevOps — we breakdown the most in-demand roles, salary expectations, and how to break into each one.",
        date: "March 1, 2025",
        readTime: "8 min read",
        category: "Technology",
        categoryColor: "bg-blue-100 text-blue-700",
    },
    {
        slug: "how-to-choose-career",
        title: "How to Choose the Right Career After Graduation",
        excerpt: "Feeling overwhelmed by options? This step-by-step guide helps you match your degree, skills, and interests to a career that fits.",
        date: "February 22, 2025",
        readTime: "6 min read",
        category: "Career Guidance",
        categoryColor: "bg-purple-100 text-purple-700",
    },
    {
        slug: "free-courses-india",
        title: "Best Free Online Courses for Indian Students in 2025",
        excerpt: "NPTEL, Coursera audit, YouTube playlists — a curated list of high-quality free courses to upskill without spending a rupee.",
        date: "February 15, 2025",
        readTime: "5 min read",
        category: "Learning",
        categoryColor: "bg-emerald-100 text-emerald-700",
    },
    {
        slug: "ai-jobs-india",
        title: "The Rise of AI Jobs in India: What You Need to Know",
        excerpt: "The AI/ML job market in India is booming. Here's what skills are needed, which companies are hiring, and realistic salary ranges.",
        date: "February 8, 2025",
        readTime: "7 min read",
        category: "Technology",
        categoryColor: "bg-blue-100 text-blue-700",
    },
    {
        slug: "resume-tips-freshers",
        title: "Resume Tips for Freshers: How to Stand Out With No Experience",
        excerpt: "No work experience? No problem. Learn how to build a compelling resume using projects, internships, and certifications.",
        date: "February 1, 2025",
        readTime: "5 min read",
        category: "Job Search",
        categoryColor: "bg-amber-100 text-amber-700",
    },
    {
        slug: "engineering-careers-non-tech",
        title: "Surprising Non-Tech Careers for Engineering Graduates",
        excerpt: "Not every engineer has to code. Explore consulting, finance, product management, and other paths open to engineering grads.",
        date: "January 25, 2025",
        readTime: "6 min read",
        category: "Career Guidance",
        categoryColor: "bg-purple-100 text-purple-700",
    },
];

export default function BlogPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-12 px-4 text-center bg-gradient-to-b from-blue-50/60 to-background">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Career Insights & Guidance</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Practical advice for students navigating the Indian job market.
                </p>
            </section>

            {/* Articles */}
            <section className="py-12 px-4 container mx-auto max-w-4xl">
                <div className="space-y-6">
                    {articles.map((article) => (
                        <article key={article.slug} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                            <div className="flex items-start gap-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${article.categoryColor}`}>
                                            {article.category}
                                        </span>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                                        Read article <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-secondary/30 rounded-xl border border-border">
                    <p className="text-muted-foreground text-sm">More articles coming soon. Have a topic you want us to cover?</p>
                    <a href="mailto:blog@careerai.app" className="text-primary text-sm font-semibold underline underline-offset-4 mt-1 inline-block">
                        Suggest a topic →
                    </a>
                </div>
            </section>
        </main>
    );
}
