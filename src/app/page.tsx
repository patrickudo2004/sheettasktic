"use client";

import { useSheetToTasks } from '@/context/SheetToTasksContext';
import Header from '@/components/layout/Header';
import Stepper from '@/components/Stepper';
import UploadStep from '@/components/steps/UploadStep';
import MappingStep from '@/components/steps/MappingStep';
import PreviewStep from '@/components/steps/PreviewStep';
import SyncStep from '@/components/steps/SyncStep';

export default function Home() {
  const { step } = useSheetToTasks();

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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <Stepper />
          <div className="mt-8">
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
