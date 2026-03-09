import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — CareerAI",
    description: "How CareerAI collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen">
            <section className="pt-32 pb-12 px-4 container mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm mb-10">Last updated: March 2025</p>

                <div className="prose prose-sm max-w-none space-y-8 text-foreground">
                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">When you create an account, we collect your email address, display name, and any profile information you provide (education, skills, interests). We also store your usage data such as saved careers, course interactions, and roadmap progress.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm leading-relaxed">
                            <li>To personalize career, course, and roadmap recommendations</li>
                            <li>To provide the AI chat with context about your background</li>
                            <li>To save your preferences and progress across sessions</li>
                            <li>To improve the accuracy and relevance of our recommendations</li>
                            <li>To send product updates and important service notices (no spam)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">3. Data Storage</h2>
                        <p className="text-muted-foreground leading-relaxed">Your data is stored in Google Firestore, a secure cloud database. Authentication is handled by Firebase Authentication. Both services are SOC 2 and ISO 27001 certified. Your data is stored in data centres compliant with Indian data residency requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">4. AI and Data Processing</h2>
                        <p className="text-muted-foreground leading-relaxed">Your profile information is sent to Google Gemini to generate personalized recommendations. We do not store your chat messages permanently — they are only used within a session. We do not sell your data to any third party. Google's AI usage policies apply to data processed by Gemini.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">5. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">We use minimal cookies strictly necessary for authentication (Firebase session tokens). We do not use advertising or analytics cookies. You can clear cookies at any time through your browser settings.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">6. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">You have the right to access, correct, or delete your personal data at any time. You can update your profile from the Profile page. To request complete data deletion, email us at <a href="mailto:privacy@careerai.app" className="text-primary underline underline-offset-2">privacy@careerai.app</a>. We will respond within 7 business days.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">7. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">We retain your data for as long as your account is active. If you delete your account, all personal data will be removed within 30 days. Anonymised, aggregated data may be retained for service improvement purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">8. Third-Party Services</h2>
                        <p className="text-muted-foreground leading-relaxed">CareerAI uses the following third-party services: Firebase (Google) for auth and database, Google Gemini for AI. External course links open on platforms such as Coursera, Udemy, NPTEL, and YouTube. CareerAI is not responsible for the privacy practices of these external platforms.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">9. Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">We may update this Privacy Policy from time to time. Changes will be reflected with an updated date at the top of this page. Continued use of CareerAI after changes constitutes acceptance of the updated policy.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 text-foreground">10. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For privacy-related questions or requests, contact us at{" "}
                            <a href="mailto:privacy@careerai.app" className="text-primary underline underline-offset-2">privacy@careerai.app</a>.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
