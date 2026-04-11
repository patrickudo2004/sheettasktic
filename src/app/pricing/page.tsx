"use client";

import { Check, Sparkles, Zap, Building2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the AI mapping.",
    icon: <Zap className="h-6 w-6 text-muted-foreground" />,
    features: [
      "2 sheet imports per day",
      "Max 50 rows per sheet",
      "Google Tasks Sync",
      "Standard AI mapping",
      "Ad-supported dashboard"
    ],
    cta: "Get Started",
    href: "/login",
    popular: false
  },
  {
    name: "Hobbyist",
    price: "$9",
    period: "/mo",
    description: "For the personal productivity power-user.",
    icon: <Crown className="h-6 w-6 text-amber-500" />,
    features: [
      "20 sheet imports per day",
      "Max 500 rows per sheet",
      "Google Tasks, To Do, Notion",
      "Advanced Date Extraction",
      "Ad-free experience"
    ],
    cta: "Go Pro",
    href: "/login",
    popular: true
  },
  {
    name: "Business",
    price: "$29",
    period: "/mo",
    description: "Scale your workflow for teams and CRMs.",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    features: [
      "Unlimited imports",
      "Max 5,000 rows per sheet",
      "Jira, HubSpot, Salesforce",
      "Custom Field Mapping",
      "Priority AI support"
    ],
    cta: "Get Business",
    href: "/login",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-sm font-semibold text-primary tracking-wide uppercase">Pricing</h2>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Simple, transparent <span className="text-primary italic">pricing.</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your productivity vibe. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-8 bg-card border rounded-2xl shadow-sm transition-all hover:shadow-xl ${plan.popular ? 'ring-2 ring-primary scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {plan.icon}
                  <h3 className="text-xl font-bold text-card-foreground">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
              </div>

              <ul className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                className="w-full h-12 text-base font-semibold" 
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center space-y-4">
          <p className="text-muted-foreground italic">"Processing millions of rows? Need a custom Enterprise plan?"</p>
          <Link href="mailto:support@sheettasktic.ai" className="text-primary font-semibold hover:underline">
            Contact us for bulk pricing
          </Link>
        </div>
      </main>
    </div>
  );
}
