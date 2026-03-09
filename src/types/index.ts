export type EducationLevel = "10+2" | "Diploma" | "UG" | "PG" | "PhD";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    education: {
        level: EducationLevel;
        degree?: string; // e.g. B.Tech
        stream?: string; // e.g. Computer Science
        college?: string;
        yearOfCompletion?: number;
    };
    skills: {
        id: string;
        name: string;
        proficiency: "Beginner" | "Intermediate" | "Advanced";
    }[];
    interests: string[];
    savedCareers: string[]; // Career IDs
    savedCourses: string[]; // Course IDs
}

export interface Career {
    id: string;
    title: string;
    description: string;
    domain: string; // e.g. "Tech", "Finance"
    matchScore?: number; // 0-100, specific to user context
    matchReason?: string;
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    outlook: "Growing" | "Stable" | "Declining";
    requiredSkills: string[]; // Skill names/IDs
}

export interface Course {
    id: string;
    title: string;
    provider: string; // e.g. Coursera, Udemy, University
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    rating: number;
    url: string;
    tags: string[];
    skillsCovered: string[];
}

export interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    resourceLink?: string;
    duration?: string;
    status: "Pending" | "In Progress" | "Completed";
    type: "Learn" | "Build" | "Certify" | "Apply";
}

export interface Roadmap {
    id: string;
    careerId: string;
    title: string;
    description: string;
    steps: {
        shortTerm: RoadmapStep[];
        midTerm: RoadmapStep[];
        longTerm: RoadmapStep[];
    };
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    metadata?: {
        type: "text" | "career-list" | "career-response" | "course-list" | "roadmap" | "clarification" | "greeting";
        data?: any;
    };
}
