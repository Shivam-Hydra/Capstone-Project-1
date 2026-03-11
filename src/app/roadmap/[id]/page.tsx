"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { Career, Roadmap } from "@/types";
import { auth } from "@/lib/firebase";
import { CAREERS } from "@/lib/mock-data";
import { Loader2, ArrowLeft, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailedCurvedRoadmap } from "@/components/roadmap/DetailedCurvedRoadmap";

export default function RoadmapPage() {
    const params = useParams();
    const router = useRouter();
    const { chatCareers, savedCareers, recommendedCareers } = useUserStore();
    
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const careerId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;

    useEffect(() => {
        if (!careerId) return;

        // Find the career in local state or mock data
        const career = chatCareers.find(c => c.id === careerId) || 
                      savedCareers.find(c => c.id === careerId) ||
                      recommendedCareers.find(c => c.id === careerId) ||
                      CAREERS.find(c => c.id === careerId);

        if (!career) {
            setError("Career not found. Please navigate back and try again.");
            setLoading(false);
            return;
        }

        const generateRoadmap = async (careerData: Career) => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const response = await fetch("/api/roadmap", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        careerId: careerData.id,
                        careerTitle: careerData.title,
                        careerDescription: careerData.description
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to generate roadmap.");
                }

                setRoadmap(data.roadmap);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateRoadmap(career);
    }, [careerId, chatCareers, savedCareers]);

    if (!mounted) return null;

    return (
        <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 px-4 animate-fade-in flex flex-col items-center">
            
            <div className="w-full max-w-5xl mb-8">
                <Button variant="ghost" className="gap-2 mb-6 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" /> Back to Careers
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-600" />
                        <Target className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Generating Your Path
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Our AI is analyzing industry standards to build a custom roadmap for this career...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center flex-1 space-y-4 max-w-md text-center p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Couldn't load roadmap</h2>
                    <p className="text-sm text-red-600/80 dark:text-red-400">
                        {error}
                    </p>
                    <Button onClick={() => router.back()} variant="outline" className="mt-4">
                        Go Back
                    </Button>
                </div>
            ) : roadmap ? (
                <div className="w-full flex-1 flex flex-col items-center">
                    <div className="text-center max-w-3xl mb-4 px-4">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/30 mb-4">
                            <Target className="h-3.5 w-3.5" /> AI Roadmap
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                            {roadmap.title}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                            {roadmap.description}
                        </p>
                    </div>

                    <DetailedCurvedRoadmap roadmap={roadmap} />
                </div>
            ) : null}
            
        </div>
    );
}
