"use client";

import { useState } from "react";
import { useAuth, getAuthErrorMessage } from "@/lib/auth-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDocument } from "@/lib/user-service";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Loader2, Mail } from "lucide-react";

interface LoginOverlayProps {
    messageCount: number;
    onClose?: () => void; // optional — close is only allowed if count < 10
}

export function LoginOverlay({ messageCount, onClose }: LoginOverlayProps) {
    const { signInWithGoogle } = useAuth();
    const [mode, setMode] = useState<"choice" | "signin" | "signup">("choice");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // overlay will disappear automatically via auth state change
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await createUserDocument(result.user, name);
            // overlay will disappear automatically via auth state change
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    const isHardBlock = messageCount >= 10;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* Frosted backdrop */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

            {/* Card */}
            <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in-95 duration-300">
                {/* Close button — only when not hard-blocked */}
                {!isHardBlock && onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    {isHardBlock ? (
                        <>
                            <h2 className="text-xl font-bold text-foreground">You've used 10 free messages</h2>
                            <p className="text-sm text-muted-foreground mt-2">Sign in to keep this conversation going — your chat history will be saved.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-foreground">Sign in for more</h2>
                            <p className="text-sm text-muted-foreground mt-2">Get unlimited conversations and personalized career guidance.</p>
                        </>
                    )}
                </div>

                {/* Google Sign-In */}
                {mode === "choice" && (
                    <div className="space-y-4">
                        <Button
                            onClick={handleGoogle}
                            disabled={loading}
                            className="w-full h-11 gap-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm"
                            variant="outline"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                                <span className="bg-card px-3">or email</span>
                            </div>
                        </div>

                        <Button onClick={() => setMode("signin")} variant="outline" className="w-full gap-2">
                            <Mail className="h-4 w-4" /> Sign in with email
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            No account?{" "}
                            <button onClick={() => setMode("signup")} className="text-primary font-semibold underline underline-offset-2">
                                Sign up free
                            </button>
                        </p>
                    </div>
                )}

                {/* Email Sign In */}
                {mode === "signin" && (
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full bg-primary text-white hover:bg-primary/90 h-11 gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign In
                        </Button>
                        <button type="button" onClick={() => { setMode("choice"); setError(""); }} className="text-xs text-muted-foreground underline w-full text-center">
                            ← Back
                        </button>
                    </form>
                )}

                {/* Email Sign Up */}
                {mode === "signup" && (
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full bg-primary text-white hover:bg-primary/90 h-11 gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
                        </Button>
                        <button type="button" onClick={() => { setMode("choice"); setError(""); }} className="text-xs text-muted-foreground underline w-full text-center">
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
