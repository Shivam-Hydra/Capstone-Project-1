import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-card py-12 text-sm mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-lg text-foreground tracking-tight">CareerAI</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering your future with data-driven career guidance and personalized roadmaps.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/roadmap" className="hover:text-primary transition-colors">Roadmap Tool</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Career Blog</Link></li>
                            <li><Link href="/guides" className="hover:text-primary transition-colors">Industry Guides</Link></li>
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} CareerAI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
