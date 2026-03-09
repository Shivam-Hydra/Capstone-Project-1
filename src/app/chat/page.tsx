"use client";

import { useState, useEffect } from "react";
import { QualificationInput } from "@/components/chat/QualificationInput";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Sparkles } from "lucide-react";
import { useUserStore } from "@/lib/store";

export default function ChatPage() {
    const { setProfile, completeOnboarding } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");

    // Always show the qualification form first on every page visit
    const [showChat, setShowChat] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleQualificationSubmit = async (data: any) => {
        setIsLoading(true);

        // Build the auto-message that will trigger the AI analysis immediately
        const autoMsg = data.type === "text"
            ? data.content
            : `I'm a ${data.level} student${data.degree ? ` pursuing ${data.degree}` : ""}${data.stream ? ` in ${data.stream}` : ""}. Please analyse my profile and suggest the best career paths and courses for me.`;

        setInitialMessage(autoMsg);
        await new Promise(resolve => setTimeout(resolve, 800));
        setProfile(data);
        completeOnboarding();
        setShowChat(true);
        setIsLoading(false);
    };

    if (!mounted) return null;


    return (
        <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

            {!showChat ? (
                <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 ring-1 ring-primary/10">
                            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold force-text-contrast">
                            Let&apos;s Map Your Future
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Tell us a bit about your background for tailored advice — or just start chatting!
                        </p>
                    </div>
                    <QualificationInput onSubmit={handleQualificationSubmit} />
                </div>
            ) : (
                <ChatWindow initialMessage={initialMessage} />
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-foreground font-medium animate-pulse">Analyzing your profile...</p>
                </div>
            )}
        </main>
    );
}
