"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { useSheetToTasks } from '@/context/SheetToTasksContext';
import Header from '@/components/layout/Header';
import Stepper from '@/components/Stepper';
import UploadStep from '@/components/steps/UploadStep';
import MappingStep from '@/components/steps/MappingStep';
import PreviewStep from '@/components/steps/PreviewStep';
import SyncStep from '@/components/steps/SyncStep';
import { Loader2 } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const { step } = useSheetToTasks();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Waking up the AI...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UploadStep />;
      case 2:
        return <MappingStep />;
      case 3:
        return <PreviewStep />;
      case 4:
        return <SyncStep />;
      default:
        return <UploadStep />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <div className="p-4 md:p-8">
            <Stepper />
            <div className="mt-8">
                {renderStep()}
            </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
