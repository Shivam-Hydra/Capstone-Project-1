import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Career, Course, ChatMessage } from '@/types';

interface UserState {
    profile: Partial<UserProfile> | null;
    savedCareers: Career[];
    chatCareers: Career[];          // Latest career recommendations from chat
    chatCourses: Course[];          // Latest course recommendations from chat
    chatMessages: ChatMessage[];    // Persisted chat history
    hasCompletedOnboarding: boolean;

    setProfile: (profile: Partial<UserProfile>) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    completeOnboarding: () => void;
    saveCareer: (career: Career) => void;
    removeCareer: (careerId: string) => void;
    setChatCareers: (careers: Career[]) => void;
    setChatCourses: (courses: Course[]) => void; // Save courses from chat response
    
    // Chat Persistence Actions
    addChatMessage: (message: ChatMessage) => void;
    setChatMessages: (messages: ChatMessage[]) => void;
    clearChat: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            savedCareers: [],
            chatCareers: [],
            chatCourses: [],
            chatMessages: [],
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

            setChatCareers: (careers) => set({ chatCareers: careers }),
            setChatCourses: (courses) => set({ chatCourses: courses }),

            addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
            setChatMessages: (msgs) => set({ chatMessages: msgs }),
            clearChat: () => set({ chatMessages: [], chatCareers: [], chatCourses: [] }),
        }),
        {
            name: 'career-ai-storage',
        }
    )
);
