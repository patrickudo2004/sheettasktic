"use client";

import React from 'react';
import { useUser } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CreditCard, Settings, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="flex flex-grow container mx-auto px-4 py-6 gap-6">
        
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-card rounded-2xl border p-6 space-y-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Main</p>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium bg-primary/10 text-primary hover:bg-primary/20" asChild>
                  <Link href="/dashboard"><LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground" asChild>
                  <Link href="/pricing"><CreditCard className="mr-3 h-4 w-4" /> Subscription</Link>
                </Button>
              </nav>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Support</p>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">
                  <Settings className="mr-3 h-4 w-4" /> Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">
                  <HelpCircle className="mr-3 h-4 w-4" /> Help Center
                </Button>
              </nav>
            </div>

            <div className="pt-4 border-t">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                <p className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3" /> PRO TIP
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  Connect your Notion account to sync tasks instantly with your team.
                </p>
                <Button variant="link" size="sm" className="p-0 h-4 text-xs font-bold mt-2 h-auto" asChild>
                    <Link href="/pricing" className="flex items-center">Learn More <ExternalLink className="ml-1 h-3 w-3" /></Link>
                </Button>
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

        {/* Right Sidebar - AD SPACE */}
        <aside className="hidden xl:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted rounded-2xl border-2 border-dashed border-border h-[600px] flex flex-col items-center justify-center p-6 text-center">
               <div className="text-muted-foreground space-y-2">
                 <p className="text-xs font-bold uppercase tracking-widest">Sponsored</p>
                 <div className="bg-background rounded w-full aspect-[160/600] mb-4 flex items-center justify-center border">
                    <p className="text-xs italic p-4 text-muted-foreground">Ad Slot (Pro users can hide this)</p>
                 </div>
                 <p className="text-xs italic max-w-[150px] mx-auto">Want to advertise here? Contact support@sheettasktic.ai</p>
               </div>
            </div>
            
            <div className="p-4 bg-card rounded-xl border shadow-sm text-center">
               <p className="text-xs text-muted-foreground mb-2">Hate ads?</p>
               <Button variant="outline" size="sm" className="w-full font-bold" asChild>
                  <Link href="/pricing">Go Ad-Free</Link>
               </Button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
