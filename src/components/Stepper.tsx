"use client";

import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { cn } from '@/lib/utils';
import { UploadCloud, PencilRuler, ListTodo, Send } from 'lucide-react';

const steps = [
  { id: 1, name: 'Upload', icon: UploadCloud },
  { id: 2, name: 'Map Columns', icon: PencilRuler },
  { id: 3, name: 'Preview & Polish', icon: ListTodo },
  { id: 4, name: 'Sync & Export', icon: Send },
];

export default function Stepper() {
  const { step: currentStep } = useSheetToTasks();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={cn(
                "group flex items-start gap-x-3 md:flex-col md:gap-x-0 md:gap-y-2",
                step.id < currentStep ? "cursor-pointer" : ""
              )}
              aria-current={step.id === currentStep ? 'step' : undefined}
            >
              <div className="flex h-10 w-full items-center">
                <div
                  className={cn(
                    "flex-none rounded-full p-2",
                    step.id <= currentStep
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                >
                  <step.icon
                    className={cn(
                      "h-6 w-6",
                      step.id <= currentStep
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-4 md:ml-0 md:mt-2">
                  <span className={cn(
                    "text-sm font-medium",
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  )}>
                    Step {step.id}
                  </span>
                  <p className="text-sm font-semibold">{step.name}</p>
                </div>
              </div>
              {step.id < steps.length && (
                <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 -translate-x-1/2">
                   <div className={cn(
                      "h-0.5 w-full",
                       step.id < currentStep ? "bg-primary" : "bg-border"
                   )} style={{width: 'calc(100% - 2.5rem)', marginLeft: 'calc(2.5rem + 1rem)', marginRight: '1rem'}}></div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
