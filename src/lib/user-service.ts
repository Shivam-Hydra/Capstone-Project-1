import { doc, setDoc, getDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";

import { db } from "./firebase";
import { UserProfile } from "@/types";
import { User } from "firebase/auth";

/** Creates a new user document in Firestore after signup */
export async function createUserDocument(user: User, name: string): Promise<void> {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    // Only create if it doesn't already exist (handles Google re-login)
    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            name: name || user.displayName || "User",
            email: user.email,
            createdAt: serverTimestamp(),
            education: {},
            skills: [],
            interests: [],
            savedCareers: [],
            hasCompletedOnboarding: false,
        });
    }
}

/** Fetches a user's profile document from Firestore */
export async function getUserDocument(uid: string): Promise<Partial<UserProfile> | null> {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data() as Partial<UserProfile>;
    }
    return null;
}

/** Partially updates a user's Firestore document */
export async function updateUserDocument(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data as Record<string, unknown>);
}

/** Saves a career to the user's savedCareers array in Firestore */
export async function saveCareerToFirestore(uid: string, career: { id: string; title: string; domain: string }): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        savedCareers: arrayUnion(career),
    });
}

/** Removes a career from the user's savedCareers array in Firestore */
export async function removeCareerFromFirestore(uid: string, careerId: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    // arrayRemove needs the exact object — we filter by id instead via a read+write
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        const data = snapshot.data();
        const updated = (data.savedCareers || []).filter((c: any) => c.id !== careerId);
        await updateDoc(userRef, { savedCareers: updated });
    }
}

/** Marks onboarding as complete in Firestore */
export async function completeOnboardingInFirestore(uid: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { hasCompletedOnboarding: true });
}
