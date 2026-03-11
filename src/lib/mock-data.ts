import { Career, Course, Roadmap, UserProfile } from "@/types";

// --- Sample Data ---

export const CAREERS: Career[] = [
    {
        id: "c1",
        title: "Full Stack Developer",
        description: "Build end-to-end web applications using modern frameworks.",
        domain: "Technology",
        salaryRange: { min: 600000, max: 1800000, currency: "INR" },
        outlook: "Growing",
        requiredSkills: ["React", "Node.js", "TypeScript", "Database Design"],
        matchScore: 95,
        matchReason: "✓ Programming interest\n✓ Problem solving\n✓ Tech-focused skills"
    },
    {
        id: "c2",
        title: "Data Scientist",
        description: "Extract insights from complex data sets using statistical methods.",
        domain: "Data Science",
        salaryRange: { min: 800000, max: 2500000, currency: "INR" },
        outlook: "Growing",
        requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL"],
        matchScore: 88,
        matchReason: "✓ Strong analytical skills\n✓ Statistics background\n✓ Data visualization"
    },
    {
        id: "c3",
        title: "Product Manager",
        description: "Lead product strategy and development lifecycles.",
        domain: "Management",
        salaryRange: { min: 1200000, max: 3000000, currency: "INR" },
        outlook: "Stable",
        requiredSkills: ["Agile", "Communication", "Market Research", "UX Basics"],
        matchScore: 75,
        matchReason: "✓ Leadership potential\n✓ Strategic thinking\n✓ Product lifecycle knowledge"
    },
    {
        id: "c4",
        title: "AI Engineer",
        description: "Design and implement machine learning models and AI systems.",
        domain: "Technology",
        salaryRange: { min: 1000000, max: 2800000, currency: "INR" },
        outlook: "Growing",
        requiredSkills: ["PyTorch", "NLP", "Deep Learning", "Algorithms"],
        matchScore: 92,
        matchReason: "✓ Math foundations\n✓ Advanced algorithms\n✓ Interest in future tech"
    },
    {
        id: "c5",
        title: "Cybersecurity Analyst",
        description: "Protect organizational networks and data from security breaches.",
        domain: "Security",
        salaryRange: { min: 700000, max: 2000000, currency: "INR" },
        outlook: "Growing",
        requiredSkills: ["Networks", "Ethical Hacking", "Cryptography", "Risk Assessment"],
        matchScore: 82,
        matchReason: "✓ Attention to detail\n✓ Security mindset\n✓ Systems knowledge"
    },
    {
        id: "c6",
        title: "Robotics Engineer",
        description: "Design and build robots and robotic systems.",
        domain: "Engineering",
        salaryRange: { min: 800000, max: 2200000, currency: "INR" },
        outlook: "Growing",
        requiredSkills: ["Control Systems", "Embedded C", "C++", "CAD"],
        matchScore: 78,
        matchReason: "✓ Physics background\n✓ Hardware interest\n✓ Complex mapping"
    }
];

export const COURSES: Course[] = [
    {
        id: "co1",
        title: "Advanced React Patterns",
        provider: "Frontend Masters",
        level: "Advanced",
        duration: "10 hours",
        rating: 4.8,
        url: "https://frontendmasters.com",
        tags: ["Frontend", "React"],
        skillsCovered: ["React", "Performance"],
    },
    {
        id: "co2",
        title: "Machine Learning A-Z",
        provider: "Udemy",
        level: "Beginner",
        duration: "40 hours",
        rating: 4.5,
        url: "https://udemy.com",
        tags: ["AI", "Python"],
        skillsCovered: ["Machine Learning", "Python"],
    },
];

export const ROADMAPS: Record<string, Roadmap> = {
    "c1": {
        id: "r1",
        careerId: "c1",
        title: "Full Stack Developer Roadmap",
        description: "Your path to becoming a Senior Full Stack Engineer.",
        steps: {
            shortTerm: [
                { id: "s1", title: "Master React", description: "Learn Hooks, Context, and performance.", status: "In Progress", type: "Learn" },
                { id: "s2", title: "Build Portfolio Site", description: "Showcase your projects.", status: "Pending", type: "Build" },
            ],
            midTerm: [
                { id: "s3", title: "Learn Node.js Backend", description: "Express, NestJS, and Database integration.", status: "Pending", type: "Learn" },
            ],
            longTerm: [
                { id: "s4", title: "System Design", description: "Learn to scale applications.", status: "Pending", type: "Apply" },
            ],
        },
    },
};

// --- Mock Service Functions ---

export async function mockAnalyzeProfile(profile: Partial<UserProfile>): Promise<Career[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple keyword matching logic for demo
    if (profile.interests?.some(i => i.toLowerCase().includes("data"))) {
        return [CAREERS[1], CAREERS[0], CAREERS[2]];
    }
    return CAREERS;
}

export async function mockGetRoadmap(careerId: string): Promise<Roadmap | null> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return ROADMAPS[careerId] || null;
}

export async function mockGetCourses(careerId: string): Promise<Course[]> {
    // Return random courses for demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return COURSES;
}
