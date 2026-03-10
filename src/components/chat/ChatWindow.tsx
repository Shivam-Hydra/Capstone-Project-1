"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, RotateCcw, Lock, FileText, Link as LinkIcon } from "lucide-react";
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
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

    // ── File Upload Handler ───────────────────────────────────────────────
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so the same file can be selected again if needed
        e.target.value = "";

        if (file.size > 5 * 1024 * 1024) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: "⚠️ The file is too large. Please upload a PDF or DOCX under 5MB.",
                timestamp: new Date()
            }]);
            return;
        }

        setIsTyping(true);
        const baseCount = userMessageCount;

        // Add a temporary user message so the UI responds instantly
        const tempId = Date.now().toString();
        const rawUserMsg: ChatMessage = {
            id: tempId,
            role: "user",
            content: `Uploading document: **${file.name}**...`,
            timestamp: new Date(),
            metadata: {
                type: "file-upload",
                data: {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    status: "uploading"
                }
            } as any
        };

        const updatedWithTemp = [...messagesRef.current, rawUserMsg];
        setMessages(updatedWithTemp);
        setUserMessageCount(baseCount + 1);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const token = await getAuthToken();
            const uploadRes = await fetch("/api/chat/upload", {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || "Failed to process the uploaded file.");
            }

            // Successfully extracted text from the document.
            const extractedText = uploadData.text;
            const simulatedUserPrompt = `I have uploaded my profile/resume. Here is the extracted text from my document:\n\n"""\n${extractedText}\n"""\n\nPlease analyze my qualifications and suggest the best career paths and courses based exclusively on this information.`;

            // Update the temporary message to "completed" status
            const completedUserMsg: ChatMessage = {
                ...rawUserMsg,
                content: `Uploaded document: **${file.name}**`,
                metadata: {
                    ...rawUserMsg.metadata,
                    data: { ...rawUserMsg.metadata?.data, status: "completed" }
                } as any
            };

            const finalizedMessages = updatedWithTemp.map(m => m.id === tempId ? completedUserMsg : m);
            setMessages(finalizedMessages);

            // Create a hidden prompt variant strictly for the API request so we don't clog the UI
            const apiMsg: ChatMessage = { ...completedUserMsg, content: simulatedUserPrompt };

            const conversationMsgs = finalizedMessages.filter(
                m => !m.metadata?.type || (m.metadata.type as string) !== "greeting"
            ).map(m => m.id === tempId ? apiMsg : m); // Swap the visual msg with the data-rich one

            await callApi(conversationMsgs, baseCount + 1);

        } catch (err: any) {
            console.error("Upload handler error:", err);
            // Update the temporary message to show error instead of removing it
            const errorUserMsg: ChatMessage = {
                ...rawUserMsg,
                content: `Failed to upload: **${file.name}**`,
                metadata: {
                    ...rawUserMsg.metadata,
                    data: {
                        ...rawUserMsg.metadata?.data,
                        status: "error",
                        error: err.message || "Failed to process file"
                    }
                } as any
            };

            setMessages(prev => prev.map(m => m.id === tempId ? errorUserMsg : m));
            setUserMessageCount(baseCount); // rollback count conceptually if needed, though message stays
            setIsTyping(false);
        }
    };

    // ── Reset ─────────────────────────────────────────────────────────────
    const handleReset = () => {
        const greeting = `Hello! I'm CareerAI. Tell me about your education or qualification and I'll suggest the best career paths and courses for you.`;
        setMessages([{ id: Date.now().toString(), role: "assistant", content: greeting, timestamp: new Date(), metadata: { type: "greeting" } as any }]);
        setUserMessageCount(0);
        clearChat(); // Clear global store
    };

    const handleAction = (action: string, data?: any) => {
        if (action === "resend" && typeof data === "string") {
            if (isTyping) return;
            if (!user && userMessageCount >= FREE_MESSAGE_LIMIT) { setShowOverlay(true); return; }

            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: "user",
                content: data,
                timestamp: new Date(),
            };

            const updated = [...messagesRef.current, userMsg];
            setMessages(updated);

            // Send only real conversation turns (no greeting) to API
            const conversationMsgs = updated.filter(
                m => !m.metadata?.type || (m.metadata.type as string) !== "greeting"
            );
            callApi(conversationMsgs, userMessageCount);
        }
    };

    const messagesRemaining = user ? null : Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);
    const isBlocked = !user && userMessageCount >= FREE_MESSAGE_LIMIT;

    return (
        <div className="relative flex flex-col h-[80vh] w-full max-w-[1600px] mx-auto bg-card border border-border rounded-xl overflow-hidden animate-fade-in shadow-lg">

            {/* Login Overlay */}
            {showOverlay && (
                <LoginOverlay
                    messageCount={userMessageCount}
                    onClose={userMessageCount < FREE_MESSAGE_LIMIT ? () => setShowOverlay(false) : undefined}
                />
            )}

            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-xl flex items-center justify-between border-b-0 shadow-sm relative overflow-hidden">
                {/* Subtle curve at bottom to match the exact design vibe */}
                <div className="absolute -bottom-4 left-0 right-0 h-4 bg-background rounded-t-[100%] scale-105 z-0 pointer-events-none opacity-20"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-emerald-400 overflow-hidden shrink-0 border-2 border-white/20 shadow-inner flex items-center justify-center">
                        {/* We can use the user's uploaded avatar here later or keep a generic stylish one. The reference had a person. */}
                        <img src={`https://loremflickr.com/100/100/face,person?lock=105`} alt="Career Assistant" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-100 font-medium mb-0.5">Chat with</p>
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Career Assistant
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 mt-1 cursor-pointer hover:opacity-100 transition-opacity">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    {messagesRemaining !== null && (
                        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-white/20 bg-black/10 text-white backdrop-blur-sm shadow-inner`}>
                            {messagesRemaining <= 3 && <Lock className="h-3 w-3 text-white/80" />}
                            {messagesRemaining} free left
                        </div>
                    )}

                    {/* Ellipsis Menu Icon from Reference */}
                    <button className="text-white/80 hover:text-white transition-colors p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>

                    {/* The new chat reset can be moved to the ellipsis menu later, keeping it here styled differently for now */}
                    <Button variant="ghost" size="icon" onClick={handleReset} className="text-white hover:bg-white/20 transition-all rounded-full h-9 w-9" title="New Chat">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 bg-background scroll-smooth"
            >
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
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 max-w-4xl mx-auto items-center">
                        <div className="relative flex-1">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about career paths, skills, courses..."
                                disabled={isTyping}
                                maxLength={2000}
                                className="w-full bg-secondary/30 border border-border rounded-lg pl-5 pr-14 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
                            />
                            <button
                                type="button"
                                title="Attach Resume (PDF/DOCX)"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isTyping}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md disabled:opacity-50"
                            >
                                <div className="relative flex items-center justify-center">
                                    <FileText className="h-4 w-4" strokeWidth={2} />
                                    <div className="absolute -bottom-1.5 -right-1.5 bg-[#f8fafc] dark:bg-[#0f172a] rounded-full p-[1px]">
                                        <LinkIcon className="h-3 w-3" strokeWidth={3} />
                                    </div>
                                </div>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="hidden"
                            />
                        </div>
                        <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="shrink-0 bg-primary text-white hover:bg-primary/90 rounded-lg h-[46px] w-[46px] shadow-sm disabled:opacity-50">
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
