"use client";

import { InteractiveCareerOrbits } from "@/components/profile/InteractiveCareerOrbits";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserDocument, updateUserDocument } from "@/lib/user-service";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Bookmark, User, GraduationCap, Sparkles, Mail, Briefcase, ChevronRight, Target, Upload, Eye, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Career } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { storage, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
    const { user } = useAuth();
    const { savedCareers, removeCareer } = useUserStore();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Editable fields
    const [name, setName] = useState("");
    const [interests, setInterests] = useState("");
    const [skills, setSkills] = useState("");

    // Avatar upload and view states
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [viewingAvatar, setViewingAvatar] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localPhotoURL, setLocalPhotoURL] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            // Initially set to Auth photoURL if available to avoid flicker,
            // but it will be overwritten by Firestore data below if a custom Base64 avatar exists.
            setLocalPhotoURL(user.photoURL);
            getUserDocument(user.uid).then((data) => {
                setProfileData(data);
                setName(data?.name || user.displayName || "");
                setInterests((data?.interests || []).join(", "));
                setSkills((data?.skills || []).map((s: any) => s.name || s).join(", "));

                // Load the custom Base64 avatar from Firestore
                if ((data as any)?.photoURL) {
                    setLocalPhotoURL((data as any).photoURL);
                }

                setLoading(false);
            });
        }
    }, [user]);

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 256;
                    const MAX_HEIGHT = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.drawImage(img, 0, 0, width, height);

                    // Compress as 0.7 quality JPEG to ensure it easily fits in Firestore's 1MB limit
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setAvatarMenuOpen(false);
        setUploadingAvatar(true);
        try {
            // Compress image to lightweight Base64 string
            const compressedBase64 = await compressImage(file);

            // Save ONLY to Firestore to bypass Firebase Auth's photoURL length limits 
            // and completely avoid Firebase Storage bucket configuration requirements.
            await updateUserDocument(user.uid, { photoURL: compressedBase64 } as any);

            // Instantly update UI and store
            setLocalPhotoURL(compressedBase64);
            useUserStore.getState().updateProfile({ photoURL: compressedBase64 });
        } catch (error) {
            console.error("Failed to process avatar:", error);
            alert("Failed to upload your picture due to an error.");
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        const updates = {
            name,
            interests: interests.split(",").map(s => s.trim()).filter(Boolean),
            skills: skills.split(",").map(s => ({ id: s.trim(), name: s.trim(), proficiency: "Intermediate" as const })).filter(s => s.name),
        };
        await updateUserDocument(user.uid, updates);
        useUserStore.getState().updateProfile(updates);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200/20 rounded-full animate-pulse"></div>
                        <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const education = profileData?.education || {};

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    } as any;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    } as any;

    return (
        <ProtectedRoute>
            <>
                {/* Ambient background glow */}
                <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-purple-500/5 blur-[120px]"></div>
                </div>

                <div className="w-full relative min-h-[calc(100vh-6rem)] pb-24 mt-8">

                    {/* 
                  Container for Banner AND Header content.
                  By grouping them, the banner becomes a background layer 
                  and the header content sits exactly in the lower half of it. 
                */}
                    <div className="relative w-full pt-[72px] md:pt-[104px]">

                        {/* Dynamic Banner Poster (Absolute Base Layer) */}
                        <div className="absolute top-0 left-0 w-full h-[232px] md:h-[264px] bg-slate-100 dark:bg-slate-900 border-b border-black/5 dark:border-white/5 overflow-hidden z-0">
                            {localPhotoURL ? (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-80 dark:opacity-60 blur-3xl transform scale-125 saturate-150 transition-all duration-1000"
                                        style={{ backgroundImage: `url(${localPhotoURL})` }}
                                    />
                                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 mix-blend-overlay" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
                                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-blue-600/50 blur-[100px] rounded-full mix-blend-screen" />
                                        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-purple-600/40 blur-[120px] rounded-full mix-blend-screen" />
                                        <div className="absolute top-[20%] right-[20%] w-[30%] h-[100%] bg-indigo-500/40 blur-[80px] rounded-full mix-blend-screen animate-pulse" />
                                    </div>
                                </>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-slate-950 dark:via-slate-950/60" />
                        </div>

                        {/* Header Content (Foreground Layer) */}
                        <div className="container mx-auto px-4 max-w-6xl relative z-10 w-full">

                            {/* The Interactive 3-Circle Career Orbit component positioned absolutely right relative to this container */}
                            <InteractiveCareerOrbits careers={useUserStore.getState().chatCareers} />

                            {/* Header with Avatar and User Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col md:flex-row md:items-end gap-6 mb-8 text-center md:text-left relative"
                            >
                                {/* Avatar (h-40 = 160px) */}
                                <div className="relative group mx-auto md:mx-0 shrink-0">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    {/* border-background ensures it cleanly cuts out of the banner behind it */}
                                    <button
                                        onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                                        className="relative h-40 w-40 bg-slate-900 border-[6px] border-white/10 dark:border-white/10 rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 focus:outline-none"
                                    >
                                        {uploadingAvatar && (
                                            <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-sm">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                        {localPhotoURL ? (
                                            <img src={localPhotoURL} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-16 w-16 text-blue-500" />
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {avatarMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setAvatarMenuOpen(false)} />
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                <button
                                                    onClick={() => {
                                                        if (localPhotoURL) setViewingAvatar(true);
                                                        setAvatarMenuOpen(false);
                                                    }}
                                                    disabled={!localPhotoURL}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Eye className="w-4 h-4" /> View Picture
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        fileInputRef.current?.click();
                                                        setAvatarMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors mt-1"
                                                >
                                                    <Upload className="w-4 h-4" /> Upload Picture
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                    />
                                </div>

                                {/* Name Info block shifted slightly up to align logically with avatar */}
                                <div className="mb-2 md:mb-6 flex-1 text-white drop-shadow-lg">
                                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        {name || "Explorer"}
                                    </h1>
                                    <p className="text-lg font-medium flex items-center justify-center md:justify-start gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-white/90">
                                        <Mail className="h-4 w-4 text-blue-400" /> {user?.email}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Spacer to replace the negative margin eaten by pulling the header up */}
                            <div className="h-16 md:h-20"></div>

                            {/* Grid Layout */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >

                                {/* Left Column: Basic Info & Education */}
                                <div className="lg:col-span-5 space-y-8">

                                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800 rounded-[32px] p-8 shadow-2xl shadow-blue-900/5 dark:shadow-black/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>

                                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-widest mb-6">
                                            <Sparkles className="h-5 w-5 text-blue-500" /> Identity
                                        </h2>
                                        <div className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                                <input
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full bg-slate-100/50 dark:bg-slate-950/50 border-0 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                                    placeholder="What should we call you?"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800 rounded-[32px] p-8 shadow-2xl shadow-purple-900/5 dark:shadow-black/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>

                                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-widest mb-6">
                                            <GraduationCap className="h-5 w-5 text-purple-500" /> Education
                                        </h2>
                                        {education.rawText ? (
                                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl p-5 shadow-inner">{education.rawText}</p>
                                        ) : education.level ? (
                                            <div className="grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl p-5 shadow-inner">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{education.level}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stream</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{education.stream || "—"}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href="/profile/create" className="block w-full">
                                                <button className="w-full relative h-14 overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all group/btn flex items-center justify-between px-6">
                                                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Complete Calibration</span>
                                                    <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 transform group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Right Column: Skills & Saved Careers */}
                                <div className="lg:col-span-7 space-y-8">

                                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800 rounded-[32px] p-8 shadow-2xl shadow-indigo-900/5 dark:shadow-black/20 flex flex-col relative overflow-hidden h-fit">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-indigo-500" /> Career Profile
                                        </h2>
                                        <div className="space-y-6 relative z-10">
                                            <div className="space-y-1.5 flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Core Skills</label>
                                                <textarea
                                                    value={skills}
                                                    onChange={e => setSkills(e.target.value)}
                                                    placeholder="e.g. React, Data Analysis, Public Speaking..."
                                                    className="w-full bg-slate-100/50 dark:bg-slate-950/50 border-0 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner resize-none min-h-[100px]"
                                                />
                                                <p className="text-[10px] text-slate-500 font-medium ml-2 uppercase tracking-wide">Comma-separated</p>
                                            </div>
                                            <div className="space-y-1.5 flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Passions & Interests</label>
                                                <textarea
                                                    value={interests}
                                                    onChange={e => setInterests(e.target.value)}
                                                    placeholder="e.g. Artificial Intelligence, Sustainable Design..."
                                                    className="w-full bg-slate-100/50 dark:bg-slate-950/50 border-0 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner resize-none min-h-[100px]"
                                                />
                                                <p className="text-[10px] text-slate-500 font-medium ml-2 uppercase tracking-wide">Comma-separated</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 relative z-10">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold text-sm shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                {saved ? "Profile Updated!" : "Save Profile"}
                                            </button>
                                        </div>
                                    </motion.div>

                                </div>

                                {/* Full Width Bottom: Saved Careers */}
                                {savedCareers.length > 0 && (
                                    <motion.div variants={itemVariants} className="lg:col-span-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-widest mb-8">
                                            <Bookmark className="h-5 w-5 text-emerald-500" /> Bookmarked Careers
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {savedCareers.map((career: Career) => (
                                                <motion.div
                                                    whileHover={{ y: -5 }}
                                                    key={career.id}
                                                    className="group flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[24px] border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all"
                                                >
                                                    <div className="mb-6">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{career.title}</p>
                                                        <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-full uppercase tracking-wider">{career.domain}</span>
                                                    </div>
                                                    <div className="flex gap-3 mt-auto">
                                                        <Link href={`/roadmap/${career.id}`} className="flex-1">
                                                            <button className="w-full h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors">
                                                                Roadmap
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-200 dark:border-red-500/20"
                                                            onClick={() => removeCareer(career.id)}
                                                            title="Remove Career"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div> {/* End Grid Layout */}

                        </div> {/* End Foreground container (line 208) */}
                    </div> {/* End Banner AND Header content wrapper (line 183) */}
                </div> {/* End Page Wrapper (line 176) */}

                {/* View Avatar Modal */}
                {viewingAvatar && localPhotoURL && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setViewingAvatar(false)}
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 shadow-lg rounded-full text-white transition-all hover:scale-110 active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={localPhotoURL}
                            alt="Full Avatar"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        />
                    </div>
                )}
            </>
        </ProtectedRoute>
    );
}
