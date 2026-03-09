"use client";

import { useEffect, useState } from "react";
import { Career, Roadmap } from "@/types";
import { useUserStore } from "@/lib/store";
import { CareerCard } from "@/components/cards/CareerCard";
import { RoadmapView } from "@/components/cards/RoadmapView";
import { Button } from "@/components/ui/button";
import { CAREERS, mockGetRoadmap } from "@/lib/mock-data";
import { ArrowLeft, Loader2, BrainCircuit, MessageCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function CareersPage() {
    const { chatCareers, savedCareers, profile } = useUserStore();
    const [careers, setCareers] = useState<Career[]>([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(false);
    const source = chatCareers.length > 0 ? "chat" : "api";

    useEffect(() => {
        // If we have chat-generated careers, use them directly
        if (chatCareers.length > 0) {
            setCareers(chatCareers);
            return;
        }

        // Otherwise fall back to profile-based API call or mock data
        const fetchCareers = async () => {
            setLoading(true);
            try {
                if (profile) {
                    const token = await auth.currentUser?.getIdToken();
                    if (token) {
                        const res = await fetch("/api/careers", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ userProfile: profile }),
                        });
                        const data = await res.json();
                        if (res.ok && data.careers?.length > 0) {
                            setCareers(data.careers);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch {
                // silent fallback
            }
            setCareers(CAREERS);
            setLoading(false);
        };

        fetchCareers();
    }, [chatCareers, profile]);

    const handleViewRoadmap = async (id: string) => {
        const roadmap = await mockGetRoadmap(id);
        if (roadmap) setSelectedRoadmap(roadmap);
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
                {selectedRoadmap ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Button variant="ghost" onClick={() => setSelectedRoadmap(null)} className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Careers
                        </Button>
                        <RoadmapView roadmap={selectedRoadmap} />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 mb-2">
                                <BrainCircuit className="h-3.5 w-3.5" />
                                {source === "chat" ? "Based on your chat" : "AI-Recommended"}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Career Recommendations</h1>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                                {source === "chat"
                                    ? "These recommendations are generated from your recent chat. Have a new conversation to update them."
                                    : profile
                                        ? "AI-powered recommendations based on your profile. Chat with CareerAI to get personalised suggestions."
                                        : "Browse popular career paths. Complete your profile or chat with CareerAI for personalised recommendations."}
                            </p>
                            {source !== "chat" && (
                                <Link href="/chat">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-2 rounded-full px-6">
                                        <MessageCircle className="h-4 w-4" />
                                        Chat for Personalised Careers
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Career Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                                <p className="text-sm">
                                    {profile ? "Generating personalised career matches..." : "Loading careers..."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {careers.map((career) => (
                                    <CareerCard
                                        key={career.id}
                                        career={career}
                                        onViewRoadmap={handleViewRoadmap}
                                        isSaved={savedCareers.some(c => c.id === career.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
