"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { createUserDocument, getUserDocument } from "./user-service";
import { useUserStore } from "./store";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setProfile } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Load profile from Firestore into Zustand store
                const profile = await getUserDocument(firebaseUser.uid);
                if (profile) {
                    setProfile(profile);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [setProfile]);

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        // Create Firestore document for new Google users
        await createUserDocument(result.user, result.user.displayName || "");
    };

    const logout = async () => {
        await signOut(auth);
        // Clear Zustand store on logout
        useUserStore.setState({ profile: null, savedCareers: [], hasCompletedOnboarding: false });
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

/** Firebase Auth error messages mapped to human-readable strings */
export function getAuthErrorMessage(error: AuthError): string {
    switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password. Please try again.";
        case "auth/email-already-in-use":
            return "An account with this email already exists. Try logging in.";
        case "auth/weak-password":
            return "Password must be at least 6 characters.";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";
        case "auth/popup-closed-by-user":
            return "Sign-in popup was closed. Please try again.";
        default:
            return "An error occurred. Please try again.";
    }
}
