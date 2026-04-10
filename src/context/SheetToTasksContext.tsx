"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { SheetData, Task, Mapping } from '@/lib/types';

interface SheetToTasksContextType {
  step: number;
  setStep: (step: number) => void;
  sheetData: SheetData | null;
  setSheetData: (data: SheetData | null) => void;
  mappings: Mapping | null;
  setMappings: (mappings: Mapping | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
  reset: () => void;
}

const SheetToTasksContext = createContext<SheetToTasksContextType | undefined>(undefined);

const initialState = {
  step: 1,
  sheetData: null,
  mappings: null,
  tasks: [],
  fileName: '',
};

export function SheetToTasksProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(initialState.step);
  const [sheetData, setSheetData] = useState<SheetData | null>(initialState.sheetData);
  const [mappings, setMappings] = useState<Mapping | null>(initialState.mappings);
  const [tasks, setTasks] = useState<Task[]>(initialState.tasks);
  const [fileName, setFileName] = useState(initialState.fileName);

  const reset = useCallback(() => {
    setStep(initialState.step);
    setSheetData(initialState.sheetData);
    setMappings(initialState.mappings);
    setTasks(initialState.tasks);
    setFileName(initialState.fileName);
  }, []);

  const value = {
    step,
    setStep,
    sheetData,
    setSheetData,
    mappings,
    setMappings,
    tasks,
    setTasks,
    fileName,
    setFileName,
    reset,
  };

  return (
    <SheetToTasksContext.Provider value={value}>
      {children}
    </SheetToTasksContext.Provider>
  );
}

export function useSheetToTasks() {
  const context = useContext(SheetToTasksContext);
  if (context === undefined) {
    throw new Error('useSheetToTasks must be used within a SheetToTasksProvider');
  }
  return context;
}
