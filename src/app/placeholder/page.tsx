"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
    const pathname = usePathname();
    const title = pathname.split("/").pop()?.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()) || "Page";

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Construction className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Coming Soon</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
                We're working hard to bring you this feature. Stay tuned!
            </p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    );
}
