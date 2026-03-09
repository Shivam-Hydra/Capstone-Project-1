"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, RotateCcw, Lock } from "lucide-react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { LoginOverlay } from "@/components/chat/LoginOverlay";
import { ChatMessage, Career, Course } from "@/types";
import { useUserStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";

const FREE_MESSAGE_LIMIT = 10;

async function getAuthToken(): Promise<string | null> {
    try { return await auth.currentUser?.getIdToken() ?? null; }
    catch { return null; }
}

interface ChatWindowProps {
    initialMessage?: string;
}

export function ChatWindow({ initialMessage }: ChatWindowProps) {
    const { profile, setChatCareers, setChatCourses, chatMessages, setChatMessages, clearChat } = useUserStore();
    const { user } = useAuth();

    const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userMessageCount, setUserMessageCount] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Keep a live ref to messages to avoid stale closures in handlers
    const messagesRef = useRef<ChatMessage[]>(chatMessages);
    useEffect(() => { 
        messagesRef.current = messages;
        setChatMessages(messages); // Sync local state back to global store
    }, [messages, setChatMessages]);

    // Prevent double-initialization in React StrictMode
    const hasInitialized = useRef(false);

    // ── Core API call ─────────────────────────────────────────────────────
    const callApi = useCallback(async (
        messagesToSend: ChatMessage[],
        currentCount: number
    ) => {
        setIsTyping(true);
        const newCount = currentCount + 1;
        setUserMessageCount(newCount);

        if (!user && newCount >= FREE_MESSAGE_LIMIT) {
            setShowOverlay(true);
        }

        try {
            const token = await getAuthToken();
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    // Send only user/assistant messages (skip the UI greeting)
                    messages: messagesToSend
                        .filter(m => m.role === "user" || m.role === "assistant")
                        .filter(m => !m.metadata?.type || m.metadata.type !== "greeting")
                        .map(m => ({ role: m.role, content: m.content })),
                    userProfile: profile,
                }),
            });

            const data = await res.json();

            if (res.status === 429) throw new Error(data.error || "Rate limit reached. Please wait.");
            if (!res.ok) throw new Error(data.error || "Something went wrong.");

            // Build a rich message with career + course metadata
            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                // Plain-text fallback content for accessibility
                content: data.analysis || "Here are the career options and courses for you.",
                timestamp: new Date(),
                metadata: {
                    type: "career-response",
                    data: {
                        analysis: data.analysis || "",
                        careers: data.careers || [],
                        courses: data.courses || [],
                        followUp: data.followUp || "",
                    },
                },
            };

            // Save career and course recommendations to store
            if (data.careers?.length > 0) {
                setChatCareers(data.careers);
            }
            if (data.courses?.length > 0) {
                setChatCourses(data.courses);
            }

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err: any) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `⚠️ ${err.message || "Connection error. Please try again."}`,
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [user, profile]);

    // ── Initial greeting + auto-send ──────────────────────────────────────
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (chatMessages.length > 0) {
            // If we have persisted messages, calculate message count from them
            const userMsgs = chatMessages.filter(m => m.role === "user").length;
            setUserMessageCount(userMsgs);
            return;
        }

        const greeting = initialMessage
            ? `Analysing your profile — career recommendations coming right up!`
            : `Hello! I'm CareerAI. Tell me about your education or qualification and I'll suggest the best career paths and courses for you.`;

        const greetingMsg: ChatMessage = {
            id: "greeting",
            role: "assistant",
            content: greeting,
            timestamp: new Date(),
            metadata: { type: "greeting" } as any,
        };

        if (initialMessage) {
            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: "user",
                content: initialMessage,
                timestamp: new Date(),
            };
            // Show greeting + user message immediately, then call API
            const initial = [greetingMsg, userMsg];
            setMessages(initial);
            messagesRef.current = initial;
            callApi([userMsg], 0); // Only send the user message, not the greeting
        } else {
            setMessages([greetingMsg]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatMessages, initialMessage, callApi]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Hide overlay on sign-in
    useEffect(() => {
        if (user && showOverlay) setShowOverlay(false);
    }, [user, showOverlay]);

    // ── Send a new message ────────────────────────────────────────────────
    const handleSend = () => {
        if (!input.trim() || isTyping) return;
        if (!user && userMessageCount >= FREE_MESSAGE_LIMIT) { setShowOverlay(true); return; }

        const text = input.slice(0, 2000);
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        const updated = [...messagesRef.current, userMsg];
        setMessages(updated);
        setInput("");

        // Send only real conversation turns (no greeting) to API
        const conversationMsgs = updated.filter(
            m => !m.metadata?.type || (m.metadata.type as string) !== "greeting"
        );
        callApi(conversationMsgs, userMessageCount);
    };

    // ── Reset ─────────────────────────────────────────────────────────────
    const handleReset = () => {
        const greeting = `Hello! I'm CareerAI. Tell me about your education or qualification and I'll suggest the best career paths and courses for you.`;
        setMessages([{ id: Date.now().toString(), role: "assistant", content: greeting, timestamp: new Date(), metadata: { type: "greeting" } as any }]);
        setUserMessageCount(0);
        clearChat(); // Clear global store
    };

    const handleAction = (_action: string, _data?: any) => {};

    const messagesRemaining = user ? null : Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);
    const isBlocked = !user && userMessageCount >= FREE_MESSAGE_LIMIT;

    return (
        <div className="relative flex flex-col h-[80vh] w-full max-w-5xl mx-auto bg-card border border-border rounded-xl overflow-hidden animate-fade-in shadow-lg">

            {/* Login Overlay */}
            {showOverlay && (
                <LoginOverlay
                    messageCount={userMessageCount}
                    onClose={userMessageCount < FREE_MESSAGE_LIMIT ? () => setShowOverlay(false) : undefined}
                />
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground tracking-tight">Career Assistant</h2>
                        <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Online · Powered by Gemini
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {messagesRemaining !== null && (
                        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                            messagesRemaining <= 3
                                ? "text-amber-600 bg-amber-50 border-amber-200"
                                : "text-muted-foreground bg-secondary border-border"
                        }`}>
                            {messagesRemaining <= 3 && <Lock className="h-3 w-3" />}
                            {messagesRemaining} free {messagesRemaining === 1 ? "message" : "messages"} left
                        </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" /> New Chat
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} onAction={handleAction} />
                ))}
                {isTyping && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs p-4 pl-12">
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
                {isBlocked ? (
                    <div className="flex items-center justify-center gap-3 py-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        <p className="text-sm text-muted-foreground">
                            Sign in to continue.{" "}
                            <button onClick={() => setShowOverlay(true)} className="text-primary font-semibold underline underline-offset-2">
                                Sign in now →
                            </button>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 max-w-4xl mx-auto">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about career paths, skills, courses..."
                            disabled={isTyping}
                            maxLength={2000}
                            className="flex-1 bg-secondary/30 border border-border rounded-lg px-5 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
                        />
                        <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="bg-primary text-white hover:bg-primary/90 rounded-lg h-[46px] w-[46px] shadow-sm disabled:opacity-50">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                )}
                <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                    {user ? "Responses are AI-generated. Verify important decisions independently." : "Sign in for unlimited conversations and personalised guidance."}
                </p>
            </div>
        </div>
    );
}
