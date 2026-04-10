"use client";

import React, { useEffect, useState } from 'react';
import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { intelligentlyMapSpreadsheetHeaders } from '@/ai/flows/intelligently-map-spreadsheet-headers';
import type { IntelligentlyMapSpreadsheetHeadersOutput } from '@/ai/flows/intelligently-map-spreadsheet-headers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Wand2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '../ui/checkbox';
import type { Task } from '@/lib/types';
import { Separator } from '../ui/separator';
import type { Mapping } from '@/lib/types';

const TASK_FIELDS = [
  { key: 'title', label: 'Task Title', description: 'The main name of the task. Can select multiple.' },
  { key: 'notes', label: 'Notes', description: 'Additional details or description. Can select multiple.' },
  { key: 'dueDate', label: 'Due Date', description: 'When the task should be completed. Can select multiple.' },
  { key: 'priority', label: 'Priority', description: 'Task urgency (e.g., High, Medium, Low). Can select multiple.' },
  { key: 'status', label: 'Status', description: 'Current state (e.g., To Do, In Progress). Can select multiple.' },
  { key: 'parentTask', label: 'Parent Task', description: 'For creating sub-tasks. Can select multiple.' },
] as const;

type FieldKey = typeof TASK_FIELDS[number]['key'];

export default function MappingStep() {
  const { sheetData, setStep, setMappings, setTasks, reset } = useSheetToTasks();
  const [aiMappings, setAiMappings] = useState<Partial<IntelligentlyMapSpreadsheetHeadersOutput>>({});
  const [manualMappings, setManualMappings] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if(!sheetData) {
      reset();
      return;
    }
    const runAiMapping = async () => {
      setIsLoading(true);
      try {
        const result = await intelligentlyMapSpreadsheetHeaders({
          headers: sheetData.headers,
          sampleRows: sheetData.rows.slice(0, 3).map(row => row.map(cell => String(cell))),
        });
        setAiMappings(result);
        
        const initialManualMappings: Record<string, string[]> = {};
        Object.entries(result).forEach(([key, value]) => {
          if(value) {
            initialManualMappings[key] = [value];
          }
        });
        setManualMappings(initialManualMappings);

      } catch (error) {
        console.error("AI mapping failed:", error);
        toast({
          variant: "destructive",
          title: "AI Mapping Failed",
          description: "Could not get suggestions from AI. Please map fields manually.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    runAiMapping();
  }, [sheetData, toast, reset]);
  
  const handleMultiSelectChange = (field: FieldKey, header: string, checked: boolean | 'indeterminate') => {
    if(checked === 'indeterminate') return;
    setManualMappings(prev => {
      const currentSelection = prev[field] || [];
      const newSelection = checked
        ? [...currentSelection, header]
        : currentSelection.filter(h => h !== header);
      return { ...prev, [field]: newSelection };
    });
  };

  const processAndGoToNextStep = () => {
    if (!sheetData) return;

    const titleMapping = manualMappings.title;
    if (!titleMapping || (Array.isArray(titleMapping) && titleMapping.length === 0)) {
        toast({
            variant: "destructive",
            title: "Mapping Incomplete",
            description: "Please map at least one column to 'Task Title'.",
        });
        return;
    }

    const finalMappings: Mapping = {
        title: manualMappings.title || [],
        notes: manualMappings.notes || [],
        dueDate: manualMappings.dueDate || [],
        priority: manualMappings.priority || [],
        status: manualMappings.status || [],
        parentTask: manualMappings.parentTask || [],
    };
    setMappings(finalMappings);

    const generatedTasks: Task[] = sheetData.rows.map((row, index) => {
      const getCellData = (field: keyof Mapping) => {
        const headers = finalMappings[field];
        if (!headers || headers.length === 0) return undefined;
        return headers
            .map(header => row[sheetData.headers.indexOf(header)])
            .filter(Boolean)
            .join(' ');
      };
      
      const title = getCellData('title');
        
      return {
          id: `task-${index}-${Date.now()}`,
          title: title || `Untitled Task ${index + 1}`,
          notes: getCellData('notes'),
          dueDate: getCellData('dueDate'),
          priority: getCellData('priority')?.toLowerCase() as any,
          status: getCellData('status'),
          parentTask: getCellData('parentTask'),
      };
    }).filter(task => task.title && !task.title.startsWith('Untitled Task'));

    setTasks(generatedTasks);
    setStep(3);
  };

  const headers = sheetData?.headers || [];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Map Columns to Task Fields</CardTitle>
        <CardDescription>Our AI has suggested mappings based on your data. Review and adjust them as needed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-6 pt-2">
            {TASK_FIELDS.map(field => (
              <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-pulse">
                <div className="md:col-span-1"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-40 mt-2" /></div>
                <div className="md:col-span-2"><Skeleton className="h-10 w-full" /></div>
              </div>
            ))}
          </div>
        ) : (
          TASK_FIELDS.map((field, index) => (
            <React.Fragment key={field.key}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 items-start pt-2">
              <div className="md:col-span-1">
                <Label htmlFor={field.key} className="font-semibold text-base flex items-center">
                  {field.label}
                  {aiMappings[field.key as FieldKey] && (
                    <span className="ml-2 bg-primary/10 text-primary p-1 rounded-md text-xs font-mono flex items-center gap-1">
                      <Wand2 className="w-3 h-3" /> AI
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">{field.description}</p>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-2 p-3 border rounded-md bg-background">
                  {headers.map(header => (
                    <div key={`${field.key}-${header}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.key}-${header}`}
                        checked={(manualMappings[field.key] || []).includes(header)}
                        onCheckedChange={(checked) => handleMultiSelectChange(field.key, header, checked)}
                      />
                      <label htmlFor={`${field.key}-${header}`} className="text-sm font-medium leading-none cursor-pointer">
                        {header}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {index < TASK_FIELDS.length - 1 && <Separator className="mt-4"/>}
            </React.Fragment>
          ))
        )}
        {!isLoading && !Object.keys(aiMappings).length && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>AI Mapping Failed</AlertTitle>
                <AlertDescription>We couldn't generate AI suggestions. Please map the columns manually.</AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
        <Button onClick={processAndGoToNextStep} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Preview Tasks'}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
