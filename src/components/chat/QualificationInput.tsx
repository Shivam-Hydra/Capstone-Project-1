"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualificationInputProps {
    onSubmit: (data: any) => void;
}

export function QualificationInput({ onSubmit }: QualificationInputProps) {
    const [mode, setMode] = useState<"text" | "structured">("text");
    const [textInput, setTextInput] = useState("");

    // Structured State
    const [level, setLevel] = useState("");
    const [degree, setDegree] = useState("");
    const [stream, setStream] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (mode === "text") {
            onSubmit({ type: "text", content: textInput });
        } else {
            onSubmit({ type: "structured", level, degree, stream });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-card border border-border p-8 rounded-xl shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    Tell us about yourself
                </h2>

                <div className="flex bg-secondary p-1 rounded-lg border border-border">
                    <button
                        onClick={() => setMode("text")}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                            mode === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Free Text
                    </button>
                    <button
                        onClick={() => setMode("structured")}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                            mode === "structured" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Structured
                    </button>
                </div>
            </div>

            {mode === "text" ? (
                <div className="space-y-4">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="I completed BTech in Computer Science and I'm interested in AI..."
                        className="w-full h-40 bg-background border border-border rounded-lg p-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground ml-1">Education Level</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            <option value="" className="bg-background">Select Level</option>
                            <option value="10+2" className="bg-background">10+2 / High School</option>
                            <option value="UG" className="bg-background">Undergraduate</option>
                            <option value="PG" className="bg-background">Postgraduate</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground ml-1">Degree</label>
                        <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="e.g. B.Tech"
                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-semibold text-foreground ml-1">Specialization</label>
                        <input
                            type="text"
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            placeholder="e.g. Computer Science"
                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border mt-6">
                <Button
                    onClick={handleSubmit}
                    disabled={mode === "text" ? !textInput.trim() || isSubmitting : !degree.trim() || !stream.trim() || isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 transition-all w-full sm:w-auto mt-4"
                >
                    {isSubmitting ? "Starting..." : "Start Analysis"} <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
