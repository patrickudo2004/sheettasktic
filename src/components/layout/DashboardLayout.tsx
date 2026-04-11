"use client";

import React from 'react';
import { useUser } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CreditCard, Settings, HelpCircle, ExternalLink, Sparkles, Home, Menu, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FeedbackDialog } from '@/components/feedback/FeedbackDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  
  // Activate global shortcuts
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="flex flex-grow container mx-auto px-4 py-6 gap-6 mb-20 lg:mb-0">
        
        {/* Left Sidebar - Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-card rounded-2xl border p-6 space-y-6 shadow-sm sticky top-24">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Main</p>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium bg-primary/10 text-primary hover:bg-primary/20" asChild>
                  <Link href="/dashboard"><LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard</Link>
                </Button>
              </nav>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Support</p>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">
                  <Settings className="mr-3 h-4 w-4" /> Settings
                </Button>
                <FeedbackDialog />
              </nav>
            </div>

            <div className="pt-4 border-t">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                <p className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3" /> PRO TIP
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  Use <kbd className="font-sans font-bold text-primary">Cmd + Enter</kbd> to quickly sync your tasks to Notion.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Main Content */}
        <div className="flex-grow min-w-0">
          <div className="bg-card rounded-2xl border min-h-[800px] shadow-sm overflow-hidden">
             {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-50 flex items-center justify-around shadow-2xl">
            <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1" asChild>
                <Link href="/dashboard">
                    <Home className="h-5 w-5" />
                    <span className="text-[10px]">Home</span>
                </Link>
            </Button>
            <FeedbackDialog />
            <Button variant="ghost" size="icon" className="flex flex-col h-auto gap-1">
                <Settings className="h-5 w-5" />
                <span className="text-[10px]">Set</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
