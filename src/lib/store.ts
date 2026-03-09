import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Career } from '@/types';

interface UserState {
    profile: Partial<UserProfile> | null;
    savedCareers: Career[];
    hasCompletedOnboarding: boolean;

    setProfile: (profile: Partial<UserProfile>) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    completeOnboarding: () => void;
    saveCareer: (career: Career) => void;
    removeCareer: (careerId: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            savedCareers: [],
            hasCompletedOnboarding: false,

            setProfile: (profile) => set({ profile }),

            updateProfile: (updates) => set((state) => ({
                profile: { ...state.profile, ...updates }
            })),

            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            saveCareer: (career) => set((state) => {
                if (state.savedCareers.some(c => c.id === career.id)) return state;
                return { savedCareers: [...state.savedCareers, career] };
            }),

            removeCareer: (careerId) => set((state) => ({
                savedCareers: state.savedCareers.filter(c => c.id !== careerId)
            })),
        }),
        {
            name: 'career-ai-storage', // localStorage key
        }
    )
);
