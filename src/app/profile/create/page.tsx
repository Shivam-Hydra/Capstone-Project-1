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

        router.push("/chat");
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-16 animate-fade-in">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold text-foreground">Build Your Profile</h1>
                        <p className="text-muted-foreground">
                            Tell us about your educational background so we can personalize your career roadmap.
                        </p>
                    </div>
                    <QualificationInput onSubmit={handleProfileSubmit} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
