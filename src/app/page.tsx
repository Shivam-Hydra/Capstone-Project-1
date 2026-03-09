import { Button } from "@/components/ui/button";
import { Features } from "@/components/features/Features";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden bg-background">
      {/* Clean Background - Plain Solid Color */}

      <div className="z-10 flex flex-col items-center text-center max-w-3xl space-y-8 animate-fade-in py-20">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary border border-border transition-colors hover:bg-secondary/80">
          <span className="text-primary text-xs font-semibold tracking-wide uppercase">AI-Powered Career Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          Your Career, <br />
          <span className="text-primary">Clearly Mapped.</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Navigate your future with precision. Our AI analyzes your profile, identifies skill gaps,
          and builds a personalized roadmap to your dream career.
        </p>

        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Link href="/chat">
            <Button className="h-12 px-8 text-base bg-primary text-white hover:bg-primary/90 border-0 rounded-lg font-medium shadow-md transition-all active:scale-95">
              Start Career Chat
            </Button>
          </Link>
          <Link href="/profile/create">
            <Button variant="outline" className="h-12 px-8 text-base bg-background border-border text-foreground hover:bg-secondary rounded-lg transition-colors">
              Build Profile
            </Button>
          </Link>
        </div>
      </div>

      <Features />
    </main>
  );
}
