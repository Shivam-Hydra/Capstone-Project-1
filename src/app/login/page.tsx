"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth, getAuthErrorMessage } from "@/lib/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { signInWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/chat");
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
            router.push("/chat");
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to continue your career journey
                    </p>
                    <div className="text-center text-sm mt-2">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link href="/signup" className="text-primary font-semibold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>

                <div className="bg-white py-8 px-4 shadow-sm border border-blue-100 sm:rounded-xl sm:px-10">
                    {/* Google Sign-In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full mb-6 bg-white text-slate-700 border-slate-300 hover:bg-slate-50 flex items-center gap-3"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || loading}
                        id="google-login-btn"
                    >
                        {googleLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Continue with Google
                    </Button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-slate-500">Or sign in with email</span>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleEmailLogin}>
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                id="login-submit-btn"
                                type="submit"
                                className="w-full bg-primary hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                                disabled={loading || googleLoading}
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
