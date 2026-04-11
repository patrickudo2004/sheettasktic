"use client";

import Header from '@/components/layout/Header';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-2xl shadow-sm border">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last Updated: April 11, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
              <p>Welcome to SheetTasktic. We respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you use our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Data We Collect</h2>
              <p>We collect information you provide directly to us:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Account Information</strong>: Name and email address (provided via Google Sign-In).</li>
                <li><strong>Usage Data</strong>: Information about how you use our tool to improve experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Spreadsheet Data Handling</h2>
              <p className="font-semibold text-primary">Important: We do not store your spreadsheet data.</p>
              <p>When you upload a file, the data is processed in-memory. Headers and sample rows are sent to Google AI (Gemini) for intelligent mapping. This data is not saved to our database and is discarded after your session ends.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Cookies and Tracking</h2>
              <p>We use essential cookies to keep you logged in and functional cookies to remember your preferences. We may use third-party analytics (like Google Analytics) to understand site traffic.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. GDPR Compliance</h2>
              <p>As a service operating from the United Kingdom, we comply with the UK GDPR. You have the right to access, correct, or delete your personal data at any time via your account dashboard.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Changes to This Policy</h2>
              <p>We may update this policy from time to time. We will notify users of any significant changes via the email address associated with their account.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
