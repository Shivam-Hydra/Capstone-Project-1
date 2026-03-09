"use client";

import { CurvedRoadmap } from "@/components/explore/CurvedRoadmap";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
    const { profile, chatCareers, chatCourses } = useUserStore();

    const hasRecommendations = chatCareers.length > 0 || chatCourses.length > 0;

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 pt-24 pb-12 animate-fade-in min-h-[calc(100vh-4rem)]">
                <div className="space-y-8">
                    <div className="text-center space-y-4 mb-16">
                        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your Custom Career Roadmap</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {hasRecommendations 
                                ? "Here's a personalized journey connecting recommended careers and courses based on your chat." 
                                : "Chat with our AI to generate a highly personalized roadmap of careers and courses tailored just for you."}
                        </p>

                        {!hasRecommendations && (
                            <Link href="/chat" className="inline-block mt-4">
                                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full px-8 h-12 text-base">
                                    <MessageCircle className="h-5 w-5" />
                                    Start Chatting Now
                                </Button>
                            </Link>
                        )}
                    </div>

                    {hasRecommendations && (
                        <CurvedRoadmap careers={chatCareers} courses={chatCourses} />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
