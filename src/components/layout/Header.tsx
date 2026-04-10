"use client";

import { Rows } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useSheetToTasks } from '@/context/SheetToTasksContext';

export default function Header() {
  const { reset } = useSheetToTasks();
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={reset} className="flex items-center gap-2" aria-label="Go to homepage">
            <div className="p-2 bg-primary rounded-lg">
                <Rows className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-headline">
              SheetTasktic
            </h1>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
