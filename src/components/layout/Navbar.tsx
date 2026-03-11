"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth-context";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { useUserStore } from "@/lib/store";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { profile } = useUserStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsLogoutModalOpen(false);
        router.push("/");
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        { name: "Careers", href: "/careers" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
    ];

    // User initials avatar fallback
    const initials = user?.displayName
        ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0].toUpperCase() ?? "U";

    // Effective Photo URL (Custom uploaded > Google Auth)
    const photoURL = profile?.photoURL || user?.photoURL;

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/90 backdrop-blur-xl border-blue-100 shadow-sm py-2"
                    : "bg-white/50 backdrop-blur-md border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                            CareerAI
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mt-0.5">
                            Intelligence
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12 bg-slate-50/50 px-10 py-4 rounded-full border border-slate-100/50 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-xl font-medium transition-all duration-300 relative py-1 group flex flex-col items-center hover:scale-105 active:scale-95",
                                pathname === link.href
                                    ? "text-blue-600 font-semibold drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                                    : "text-slate-500 hover:text-blue-600 hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                            )}
                        >
                            <span className="relative z-10 transition-transform duration-300">
                                {link.name}
                            </span>

                            {/* Centered Expanding Underline */}
                            <span className={cn(
                                "absolute -bottom-1 h-0.5 bg-blue-600 rounded-full transition-all duration-300 origin-center",
                                pathname === link.href
                                    ? "w-full scale-x-100 opacity-100"
                                    : "w-full scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                            )} />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    {!loading && (
                        <>
                            {user ? (
                                // Logged-in state
                                <div className="flex items-center gap-3">
                                    <Link href="/profile">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group">
                                            <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                                                {photoURL ? (
                                                    <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 max-w-[100px] truncate">
                                                {profile?.name || user.displayName || user.email}
                                            </span>
                                        </div>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsLogoutModalOpen(true)}
                                        id="logout-btn"
                                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                // Logged-out state
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-5 rounded-full font-semibold shadow-md shadow-blue-200 hover:shadow-lg transition-all active:scale-95">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Actions */}
                <div className="md:hidden flex items-center gap-2">
                    <ModeToggle />
                    <button
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-blue-100 shadow-lg p-4 animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-2" />
                        {user ? (
                            <>
                                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start gap-3 px-2 py-6">
                                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                                            {photoURL ? (
                                                <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                initials
                                            )}
                                        </div>
                                        <span className="font-semibold truncate">
                                            {profile?.name || user.displayName || user.email}
                                        </span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 px-2"
                                    onClick={() => { setIsLogoutModalOpen(true); setIsMobileMenuOpen(false); }}
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />
                                    <span className="font-medium">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Log In</Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </nav>
    );
}
