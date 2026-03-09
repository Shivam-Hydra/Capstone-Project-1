import { Metadata } from "next";
import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Pricing — CareerAI",
    description: "CareerAI is free for students. Upgrade to Pro for unlimited AI conversations and advanced features.",
};

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "Perfect for students exploring their options.",
        cta: "Get Started",
        ctaHref: "/signup",
        highlight: false,
        features: [
            "5 AI chat messages per day",
            "3 career roadmaps",
            "Basic course recommendations",
            "Career explore page",
            "Save up to 3 careers",
            "Profile creation",
        ],
    },
    {
        name: "Pro",
        price: "₹199",
        period: "per month",
        description: "For serious job seekers who want unlimited guidance.",
        cta: "Coming Soon",
        ctaHref: "#",
        highlight: true,
        badge: "Most Popular",
        features: [
            "Unlimited AI conversations",
            "Unlimited roadmaps",
            "Priority course recommendations",
            "Personalized career match scores",
            "Save unlimited careers",
            "Export roadmap as PDF",
            "Early access to new features",
        ],
    },
    {
        name: "Institution",
        price: "Custom",
        period: "per seat",
        description: "For colleges and coaching centres.",
        cta: "Contact Us",
        ctaHref: "mailto:contact@careerai.app",
        highlight: false,
        features: [
            "Everything in Pro",
            "Bulk student accounts",
            "Admin dashboard",
            "Usage analytics",
            "Dedicated support",
            "Custom branding",
        ],
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-blue-50/60 to-background">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200 mb-6">
                    <Zap className="h-3.5 w-3.5" /> Simple Pricing
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Start Free. Upgrade When Ready.
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    CareerAI is free for every student. No credit card required.
                </p>
            </section>

            {/* Plans */}
            <section className="py-16 px-4 container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl border p-8 relative flex flex-col ${
                                plan.highlight
                                    ? "border-blue-500 shadow-xl shadow-blue-100 bg-blue-600 text-white scale-105"
                                    : "border-border bg-card"
                            }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    {plan.badge}
                                </div>
                            )}
                            <div className="mb-6">
                                <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-blue-100" : "text-muted-foreground"}`}>
                                    {plan.name}
                                </h2>
                                <div className="flex items-end gap-1 mb-1">
                                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-foreground"}`}>{plan.price}</span>
                                    <span className={`text-sm mb-1 ${plan.highlight ? "text-blue-200" : "text-muted-foreground"}`}>/{plan.period}</span>
                                </div>
                                <p className={`text-sm ${plan.highlight ? "text-blue-100" : "text-muted-foreground"}`}>{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-blue-200" : "text-blue-600"}`} />
                                        <span className={plan.highlight ? "text-blue-50" : "text-foreground"}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.ctaHref}
                                className={`text-center py-3 px-6 rounded-full font-semibold text-sm transition-all active:scale-95 ${
                                    plan.highlight
                                        ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                                        : "bg-secondary border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ strip */}
            <section className="py-12 px-4 bg-secondary/30 text-center border-t border-border">
                <p className="text-muted-foreground text-sm">
                    Questions? Check our <Link href="/help" className="text-primary underline underline-offset-4">FAQ page</Link> or email us at{" "}
                    <a href="mailto:contact@careerai.app" className="text-primary underline underline-offset-4">contact@careerai.app</a>
                </p>
            </section>
        </main>
    );
}
