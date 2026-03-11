"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { InteractiveFeatures } from "@/components/home/InteractiveFeatures";
import { ProductDemo } from "@/components/home/ProductDemo";
import { CareerGraphSection } from "@/components/home/CareerGraphSection";
import { PersonalizationSection } from "@/components/home/PersonalizationSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { MainFooter } from "@/components/home/MainFooter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="dark min-h-screen bg-[#0F172A] selection:bg-blue-500/30 font-space-grotesk">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <TrustSection />
        <ProductDemo />
        <InteractiveFeatures />
        <CareerGraphSection />
        <PersonalizationSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <MainFooter />
      </motion.div>
    </main>
  );
}
