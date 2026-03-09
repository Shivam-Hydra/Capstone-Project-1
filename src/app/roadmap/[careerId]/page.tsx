"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Roadmap, RoadmapStep } from "@/types";
import { ROADMAPS } from "@/lib/mock-data";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Clock, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type StepStatus = "Pending" | "In Progress" | "Completed";

export default function RoadmapPage() {
    const { careerId } = useParams<{ careerId: string }>();
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        // Load roadmap from mock data
        const found = ROADMAPS[careerId as string];
        if (found) setRoadmap(found);

        // Load step progress from Firestore
        if (user && careerId) {
            const progressRef = doc(db, "users", user.uid, "roadmapProgress", careerId as string);
            getDoc(progressRef).then((snap) => {
                if (snap.exists()) {
                    setStepStatuses(snap.data() as Record<string, StepStatus>);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [careerId, user]);

    const cycleStatus = async (stepId: string, current: StepStatus) => {
        const next: StepStatus = current === "Pending" ? "In Progress" : current === "In Progress" ? "Completed" : "Pending";
        const updated = { ...stepStatuses, [stepId]: next };
        setStepStatuses(updated);

        if (user && careerId) {
            setSaving(stepId);
            const progressRef = doc(db, "users", user.uid, "roadmapProgress", careerId as string);
            await setDoc(progressRef, updated, { merge: true });
            setSaving(null);
        }
    };

    const getStatus = (step: RoadmapStep): StepStatus =>
        stepStatuses[step.id] || step.status;

    const allSteps = roadmap
        ? [...roadmap.steps.shortTerm, ...roadmap.steps.midTerm, ...roadmap.steps.longTerm]
        : [];
    const completed = allSteps.filter(s => getStatus(s) === "Completed").length;
    const progress = allSteps.length > 0 ? Math.round((completed / allSteps.length) * 100) : 0;

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
                <Link href="/explore">
                    <Button variant="ghost" className="gap-2 mb-6">
                        <ArrowLeft className="h-4 w-4" /> Back to Explore
                    </Button>
                </Link>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : !roadmap ? (
                    <div className="text-center py-20 space-y-4">
                        <p className="text-muted-foreground">Roadmap not found for this career.</p>
                        <Link href="/explore"><Button>Browse Careers</Button></Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h1 className="text-2xl font-bold text-foreground mb-1">{roadmap.title}</h1>
                            <p className="text-sm text-muted-foreground mb-5">{roadmap.description}</p>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{completed} of {allSteps.length} steps completed</span>
                                    <span className="font-semibold text-primary">{progress}%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Roadmap Sections */}
                        {[
                            { title: "Foundation", timeframe: "0–6 Months", steps: roadmap.steps.shortTerm },
                            { title: "Growth", timeframe: "6–24 Months", steps: roadmap.steps.midTerm },
                            { title: "Mastery", timeframe: "2+ Years", steps: roadmap.steps.longTerm },
                        ].map((section) => (
                            <div key={section.title} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">{section.title}</h2>
                                        <p className="text-xs text-muted-foreground">{section.timeframe}</p>
                                    </div>
                                </div>

                                <div className="pl-5 border-l-2 border-border space-y-3">
                                    {section.steps.map((step) => {
                                        const status = getStatus(step);
                                        return (
                                            <div
                                                key={step.id}
                                                className={cn(
                                                    "bg-card border rounded-xl p-4 transition-all",
                                                    status === "Completed" && "border-emerald-200 bg-emerald-50/50",
                                                    status === "In Progress" && "border-amber-200 bg-amber-50/50",
                                                    status === "Pending" && "border-border hover:border-primary/30"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                                                        <span className={cn(
                                                            "inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                            step.type === "Learn" && "bg-blue-100 text-blue-700",
                                                            step.type === "Build" && "bg-purple-100 text-purple-700",
                                                            step.type === "Certify" && "bg-yellow-100 text-yellow-700",
                                                            step.type === "Apply" && "bg-green-100 text-green-700",
                                                        )}>
                                                            {step.type}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => cycleStatus(step.id, status)}
                                                        disabled={saving === step.id}
                                                        title="Click to cycle: Pending → In Progress → Completed"
                                                        className={cn(
                                                            "shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110",
                                                            status === "Completed" && "bg-emerald-500 border-emerald-500 text-white",
                                                            status === "In Progress" && "border-amber-400 bg-amber-50",
                                                            status === "Pending" && "border-slate-300 hover:border-primary",
                                                        )}
                                                    >
                                                        {saving === step.id ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : status === "Completed" ? (
                                                            <Check className="h-3.5 w-3.5" />
                                                        ) : status === "In Progress" ? (
                                                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                                                        ) : (
                                                            <Circle className="h-3 w-3 text-slate-300" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
