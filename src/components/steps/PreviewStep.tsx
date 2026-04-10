"use client";

import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ArrowRight, ArrowLeft, ListX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

export default function PreviewStep() {
  const { tasks, setTasks, setStep, reset } = useSheetToTasks();

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const formatDateSafe = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      let date: Date;
      // Handle Excel-like serial dates (number of days since 1900-01-01)
      if (!isNaN(Number(dateString)) && Number(dateString) > 25569) {
          date = new Date((Number(dateString) - 25569) * 86400 * 1000);
      } else {
        // Try parsing ISO or other common string formats
        date = parseISO(dateString);
        if (isNaN(date.getTime())) {
            // Handle relative dates from mock data as fallback
            if (dateString.toLowerCase() === 'tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return format(tomorrow, 'PPP');
            }
            if (dateString.toLowerCase() === 'next week') {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return format(nextWeek, 'PPP');
            }
            return dateString; // Return original string if all parsing fails
        }
      }
      return format(date, 'PPP'); // e.g., Aug 15, 2024
    } catch(e) {
      return dateString;
    }
  }

  if (!tasks) {
      reset();
      return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Preview & Polish</CardTitle>
        <CardDescription>Review the generated tasks. You can remove any you don't want to import.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Found {tasks.length} tasks to import.</p>
        <ScrollArea className="h-[450px] w-full rounded-md border">
          <div className="p-4 space-y-3">
            {tasks.length > 0 ? tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 rounded-lg bg-card border group">
                <div className="space-y-1.5 flex-grow mr-4">
                  <p className="font-semibold">{task.title}</p>
                  {task.notes && <p className="text-sm text-muted-foreground line-clamp-2">{task.notes}</p>}
                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    {task.dueDate && <Badge variant="outline">Due: {formatDateSafe(task.dueDate)}</Badge>}
                    {task.priority && <Badge variant="secondary" className="capitalize">{task.priority}</Badge>}
                    {task.status && <Badge variant="secondary">{task.status}</Badge>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
                <ListX className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold">No Tasks Generated</h3>
                <p className="mt-1">Try adjusting your column mappings.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" />Back to Mapping</Button>
        <Button onClick={() => setStep(4)} disabled={tasks.length === 0}>
          Proceed to Sync <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
