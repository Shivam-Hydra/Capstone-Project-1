"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Dark Full-Page Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    {/* Standard Premium Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-md bg-slate-900 rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
                    >
                        {/* Background Mesh for futuristic look */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] animate-pulse delay-1000" />
                        </div>

                        <div className="relative z-10 p-10">
                            {/* Close Icon */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Futuristic Header Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="h-20 w-20 rounded-[24px] bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <LogOut className="h-9 w-9 text-red-500" />
                                </div>
                            </div>

                            {/* Premium Typography */}
                            <div className="text-center mb-10">
                                <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">
                                    Sign <span className="text-red-500 italic">Out.</span>
                                </h3>
                                <p className="text-slate-400 text-base font-medium leading-relaxed">
                                    Your secure session will be closed. Are you sure you want to exit the intelligence engine?
                                </p>
                            </div>

                            {/* Futuristic Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 rounded-2xl h-14 border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all order-2 sm:order-1"
                                >
                                    STAY LOGGED IN
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    className="flex-1 rounded-2xl h-14 bg-red-600 hover:bg-red-700 text-white font-black transition-all shadow-lg shadow-red-900/40 active:scale-95 order-1 sm:order-2"
                                >
                                    CONFIRM EXIT
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
