"use client";

import Link from 'next/link';
import { ArrowRight, Zap, Target, ShieldCheck, Mail, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/provider';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">SheetTasktic</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-muted/30">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                🚀 Now powered by Gemini 2.5 Flash
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
                Turn Spreadsheet Chaos into <span className="text-primary italic">Actionable Tasks.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Manually moving data from Excel to your To-Do list is dead. Use AI to map, refine, and sync your tasks in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="h-14 px-8 text-lg" asChild>
                  <Link href="/login">
                    Start Mapping Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <Link href="#features">See How it Works</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Why use SheetTasktic?</h2>
              <p className="text-lg text-muted-foreground">The most intelligent way to manage your administrative workflow.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border bg-card hover:shadow-xl transition-shadow space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Intelligent Mapping</h3>
                <p className="text-muted-foreground">Our AI analyzes your sheet headers and contents to automatically detect titles, dates, and priorities. No manual cross-referencing required.</p>
              </div>
              
              <div className="p-8 rounded-2xl border bg-card hover:shadow-xl transition-shadow space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Deep Sync</h3>
                <p className="text-muted-foreground">Connect to Google Tasks, Microsoft To-Do, and Notion with one click. We ensure every row becomes a perfect card or task.</p>
              </div>
              
              <div className="p-8 rounded-2xl border bg-card hover:shadow-xl transition-shadow space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-muted-foreground">We don't store your spreadsheet data. It passes through our AI for processing and is deleted instantly. You own your data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Potential Ad / Pricing Placeholder */}
        <section className="py-24 border-t bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to clear your backlog?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">Join thousands of users who are automating their admin work every day.</p>
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold" asChild>
              <Link href="/login">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary rounded-lg text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">SheetTasktic</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">Built for the modern worker who values time over manual entry.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SheetTasktic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
