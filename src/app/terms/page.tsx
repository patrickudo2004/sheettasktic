"use client";

import Header from '@/components/layout/Header';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last Updated: April 11, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using SheetTasktic, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Description of Service</h2>
              <p>SheetTasktic provides an AI-powered utility to map, extract, and sync tasks from spreadsheets to third-party platforms. We provide this service on an "as is" and "as available" basis.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. User Responsibilities</h2>
              <p>You are responsible for the content of the spreadsheets you upload. You must not upload any data that violates laws, infringes on intellectual property, or contains malicious code.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Intellectual Property</h2>
              <p>All software, brand elements, and AI flows used in SheetTasktic are the property of the site owner. You are granted a limited, non-exclusive license to use the service for its intended purpose.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Termination</h2>
              <p>We reserve the right to terminate or suspend your access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Limitation of Liability</h2>
              <p>In no event shall SheetTasktic or its owner be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Contact</h2>
              <p>If you have any questions about these Terms, please contact us at support@sheettasktic.ai.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
