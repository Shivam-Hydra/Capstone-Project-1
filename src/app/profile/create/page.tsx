"use client";

import { QualificationInput } from "@/components/chat/QualificationInput";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { updateUserDocument, completeOnboardingInFirestore } from "@/lib/user-service";

export default function ProfileCreatePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { completeOnboarding, setProfile } = useUserStore();

    const handleProfileSubmit = async (data: any) => {
        // Map QualificationInput output to UserProfile shape
        const profileData: Partial<import("@/types").UserProfile> = data.type === "structured"
            ? {
                education: {
                    level: data.level as import("@/types").EducationLevel,
                    degree: data.degree,
                    stream: data.stream,
                },
                interests: [],
                skills: [],
            }
            : {
                // Free text — store as stream field for AI to use
                education: {
                    level: "UG" as import("@/types").EducationLevel, // placeholder
                    stream: data.content,
                },
                interests: [],
                skills: [],
            };

        // Save to Zustand
        setProfile(profileData);
        completeOnboarding();

        // Save to Firestore
        if (user) {
            await updateUserDocument(user.uid, profileData);
            await completeOnboardingInFirestore(user.uid);
        }

        router.push("/profile");
    };

    return (
        <ProtectedRoute>
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px]"></div>
            </div>

            <div className="min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center p-4 relative z-10 pt-12 md:pt-0">
                <div className="w-full max-w-2xl">
                    {/* Back Button */}
                    <button 
                        onClick={() => router.push('/profile')}
                        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </button>

                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-purple-900/5 dark:shadow-black/20 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-4 mb-10">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Educational Calibration
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
                                Provide your educational background to unlock highly precise, deeply personalized career paths and AI-driven growth roadmaps.
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-950/50 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800/80 p-2 sm:p-4">
                            <QualificationInput onSubmit={handleProfileSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
