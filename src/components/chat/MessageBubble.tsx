import { ChatMessage, Career, Course, Roadmap } from "@/types";
import { cn } from "@/lib/utils";
import { CareerCard } from "@/components/cards/CareerCard";
import { CourseCard } from "@/components/cards/CourseCard";
import { RoadmapView } from "@/components/cards/RoadmapView";

interface MessageBubbleProps {
    message: ChatMessage;
    onAction?: (action: string, data?: any) => void;
}

export function MessageBubble({ message, onAction }: MessageBubbleProps) {
    const isUser = message.role === "user";

    // ── Structured career-response message ───────────────────────────────
    if (!isUser && message.metadata?.type === "career-response") {
        const { analysis, careers, courses, followUp } = message.metadata.data as {
            analysis: string;
            careers: Career[];
            courses: Course[];
            followUp: string;
        };

        return (
            <div className="flex gap-4 w-full max-w-4xl justify-start">
                {/* AI Avatar */}
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 shrink-0 mt-1">
                    <span className="text-[12px] font-black tracking-tighter text-blue-600">AI</span>
                </div>

                <div className="flex flex-col gap-5 w-full">

                    {/* Analysis text */}
                    {analysis && (
                        <div className="px-6 py-4 rounded-2xl text-[15px] bg-white border border-slate-200 shadow-sm w-full">
                            <p className="leading-relaxed text-slate-700">{analysis}</p>
                        </div>
                    )}

                    {/* Career Cards */}
                    {careers && careers.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 pl-1">
                                Career Options
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {careers.map((career) => (
                                    <CareerCard
                                        key={career.id}
                                        career={career}
                                        onViewRoadmap={(id) => onAction?.("view_roadmap", id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Course Cards */}
                    {courses && courses.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 pl-1">
                                Recommended Courses & Certifications
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Follow-up question */}
                    {followUp && (
                        <div className="px-6 py-4 rounded-2xl text-[15px] bg-blue-100 border border-blue-300 shadow-sm w-full">
                            <p className="leading-relaxed text-blue-900 font-medium">{followUp}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Standard text message (user bubble or plain AI text) ─────────────
    return (
        <div className={cn("flex gap-4 w-full max-w-4xl", isUser ? "justify-end ml-auto" : "justify-start")}>
            {!isUser && (
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 shrink-0 mt-1">
                    <span className="text-[12px] font-black tracking-tighter text-blue-600">AI</span>
                </div>
            )}

            <div className={cn(
                "flex flex-col gap-2",
                isUser ? "items-end max-w-[85%]" : "items-start w-full"
            )}>
                {message.content && (
                    <div className={cn(
                        "px-6 py-4 rounded-2xl text-[15px] shadow-sm transition-all duration-200",
                        isUser
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-white border border-slate-200 text-slate-700 w-full"
                    )}>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                        </div>
                    </div>
                )}

                {/* Legacy roadmap renderer */}
                {message.metadata?.type === "roadmap" && message.metadata.data && (
                    <div className="mt-4 w-full">
                        <RoadmapView roadmap={message.metadata.data as Roadmap} />
                    </div>
                )}
            </div>
        </div>
    );
}
