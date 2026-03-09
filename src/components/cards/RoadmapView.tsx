import { Roadmap, RoadmapStep } from "@/types";
import { Check, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapViewProps {
    roadmap: Roadmap;
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
    return (
        <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6 animate-fade-in shadow-sm">
            <div className="mb-8 border-b border-border pb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{roadmap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{roadmap.description}</p>
            </div>

            <div className="relative space-y-12">
                {/* Continuous Line */}
                <div className="absolute left-[19px] top-2 bottom-4 w-px bg-border" />

                <RoadmapSection title="0-6 Months" subtitle="Foundation" steps={roadmap.steps.shortTerm} />
                <RoadmapSection title="6-24 Months" subtitle="Growth" steps={roadmap.steps.midTerm} />
                <RoadmapSection title="2+ Years" subtitle="Mastery" steps={roadmap.steps.longTerm} />
            </div>
        </div>
    );
}

function RoadmapSection({ title, subtitle, steps }: { title: string, subtitle: string, steps: RoadmapStep[] }) {
    return (
        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 z-20">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-foreground">{subtitle}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{title}</p>
                </div>
            </div>

            <div className="pl-14 space-y-3">
                {steps.map((step) => (
                    <div key={step.id} className="group bg-background hover:bg-secondary/30 rounded-lg p-4 border border-border hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{step.title}</h5>
                            {step.status === "Completed" ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : step.status === "In Progress" ? (
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                            ) : (
                                <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
