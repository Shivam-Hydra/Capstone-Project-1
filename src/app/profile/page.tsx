"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserDocument, updateUserDocument } from "@/lib/user-service";
import { useUserStore } from "@/lib/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Bookmark, User, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Career } from "@/types";

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

    useEffect(() => {
        if (user) {
            getUserDocument(user.uid).then((data) => {
                setProfileData(data);
                setName(data?.name || user.displayName || "");
                setInterests((data?.interests || []).join(", "));
                setSkills((data?.skills || []).map((s: any) => s.name || s).join(", "));
                setLoading(false);
            });
        }
    }, [user]);

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
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </ProtectedRoute>
        );
    }

    const education = profileData?.education || {};

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
                <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <User className="h-7 w-7 text-primary" /> My Profile
                </h1>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                            <Sparkles className="h-4 w-4 text-primary" /> Basic Info
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                                <input
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                            <GraduationCap className="h-4 w-4 text-primary" /> Education
                        </h2>
                        {education.rawText ? (
                            <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">{education.rawText}</p>
                        ) : education.level ? (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Level</p>
                                    <p className="text-sm font-medium text-foreground">{education.level}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Degree</p>
                                    <p className="text-sm font-medium text-foreground">{education.degree || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Stream</p>
                                    <p className="text-sm font-medium text-foreground">{education.stream || "—"}</p>
                                </div>
                            </div>
                        ) : (
                            <Link href="/profile/create">
                                <Button variant="outline" size="sm">Complete your profile →</Button>
                            </Link>
                        )}
                    </div>

                    {/* Skills & Interests */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Skills & Interests</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Skills <span className="text-muted-foreground/60">(comma-separated)</span></label>
                                <input
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    placeholder="e.g. Python, React, Communication"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Interests <span className="text-muted-foreground/60">(comma-separated)</span></label>
                                <input
                                    value={interests}
                                    onChange={e => setInterests(e.target.value)}
                                    placeholder="e.g. AI, Entrepreneurship, Design"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-white hover:bg-primary/90">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saved ? "Saved!" : "Save Changes"}
                        </Button>
                    </div>

                    {/* Saved Careers */}
                    {savedCareers.length > 0 && (
                        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Bookmark className="h-4 w-4 text-primary" /> Saved Careers
                            </h2>
                            <div className="space-y-2">
                                {savedCareers.map((career: Career) => (
                                    <div key={career.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{career.title}</p>
                                            <p className="text-xs text-muted-foreground">{career.domain}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/roadmap/${career.id}`}>
                                                <Button size="sm" variant="outline" className="text-xs h-7">View Roadmap</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs h-7 text-red-500 hover:bg-red-50"
                                                onClick={() => removeCareer(career.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
