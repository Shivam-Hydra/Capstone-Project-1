"use client";

import { useEffect, useState } from "react";
import { Career } from "@/types";
import { CAREERS, mockGetRoadmap } from "@/lib/mock-data";
import { CareerCard } from "@/components/cards/CareerCard";
import { RoadmapView } from "@/components/cards/RoadmapView";
import { Roadmap } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { auth } from "@/lib/firebase";

export default function ExplorePage() {
    const { profile, savedCareers } = useUserStore();
    const [careers, setCareers] = useState<Career[]>([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                                "Authorization": `Bearer ${token}`,
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
    }, [profile]);

    const handleViewRoadmap = async (id: string) => {
        const roadmap = await mockGetRoadmap(id);
        if (roadmap) setSelectedRoadmap(roadmap);
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 animate-fade-in">
                {selectedRoadmap ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Button variant="ghost" onClick={() => setSelectedRoadmap(null)} className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Explore
                        </Button>
                        <RoadmapView roadmap={selectedRoadmap} />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl font-bold text-foreground">Explore Careers</h1>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {profile
                                    ? "AI-powered recommendations based on your profile. Click any card to view a detailed roadmap."
                                    : "Browse popular career paths. Complete your profile for personalized recommendations."}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm">
                                    {profile ? "Generating personalized career matches..." : "Loading careers..."}
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
