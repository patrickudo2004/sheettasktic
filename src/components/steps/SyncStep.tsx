
"use client";

import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, RefreshCw, ArrowLeft, History, AlertCircle } from 'lucide-react';
import { exportAsCsv, exportAsJson, exportAsMarkdown } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const GoogleTasksIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google Tasks</title><path d="M12.438 12L7.125 6.635l-1.05 1.05L10.338 12l-4.263 4.315 1.05 1.05L12.438 12zM18 6.685l-1.05-1.05-4.263 4.315 1.05 1.05L18 6.685zm0 9.68l-4.263-4.315 1.05-1.05L18 15.315l1.05 1.05-1.05-1.05z" fill="currentColor"/></svg>;

// A more robust date parser
const parseDateToRFC3339 = (dateString: string | undefined): string | undefined => {
    if (!dateString) return undefined;
    try {
        let date;
        // Handle Excel-like serial dates (number of days since 1900-01-01, with Excel's leap year bug)
        if (!isNaN(Number(dateString)) && Number(dateString) > 25569) {
            date = new Date(Math.round((Number(dateString) - 25569) * 86400 * 1000));
        } else {
            // Attempt to parse various common date formats
            date = new Date(dateString);
        }

        // Check if the parsed date is valid
        if (isNaN(date.getTime())) {
            console.warn(`Could not parse date: "${dateString}"`);
            return undefined;
        }

        // Return date in RFC3339 format (a simplified ISO 8601)
        return date.toISOString();
    } catch (e) {
        console.error(`Error parsing date string "${dateString}":`, e);
        return undefined;
    }
};

export default function SyncStep() {
  const { tasks, fileName, setStep, reset } = useSheetToTasks();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { auth, user } = useFirebase();

  const handleGoogleSignInAndSync = async () => {
    setSyncing('Google Tasks');
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/tasks');
      const result = await signInWithPopup(auth, provider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      
      if (!accessToken) {
        throw new Error("Could not retrieve access token from Google.");
      }

      await syncTasksToGoogle(accessToken);

    } catch (error: any) {
      console.error("Google Sign-In or Sync failed:", error);
      setError(error.message || "An unexpected error occurred during Google Tasks sync.");
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Could not sync tasks with Google.",
      });
    } finally {
      setSyncing(null);
    }
  };

  const syncTasksToGoogle = async (accessToken: string) => {
    const validTasks = tasks.filter(task => task && task.title);
    if (validTasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tasks to Sync",
        description: "There are no valid tasks to send to Google Tasks.",
      });
      return;
    }
    
    toast({ title: "Syncing...", description: `Starting to sync ${validTasks.length} tasks.` });

    let successCount = 0;
    for (const task of validTasks) {
        const taskPayload = {
            title: task.title,
            notes: task.notes,
            due: parseDateToRFC3339(task.dueDate),
        };

      try {
        const response = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskPayload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to create task:", errorData, "Payload sent:", taskPayload);
        } else {
          successCount++;
        }
      } catch (e) {
         console.error("Error creating a task:", e);
      }
    }

    toast({
      title: `Sync Complete`,
      description: `Successfully sent ${successCount} of ${validTasks.length} tasks.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleSync = async (platform: string) => {
    if (platform === 'Google Tasks') {
        await handleGoogleSignInAndSync();
    }
  };
  

  const baseFileName = fileName?.split('.').slice(0, -1).join('.') || 'tasks';

  if (!tasks) {
    reset();
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Sync & Export</CardTitle>
        <CardDescription>Choose your destination. Sync to a connected service or download your tasks as a file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Cloud Sync</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4" onClick={() => handleSync('Google Tasks')} disabled={!!syncing}>
                {syncing === 'Google Tasks' ? <RefreshCw className="animate-spin mr-2" /> : <GoogleTasksIcon />}
                {syncing === 'Google Tasks' ? 'Syncing...' : 'Sync with Google Tasks'}
            </Button>
          </div>
           {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sync Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        </div>

        <Separator />

        <div>
            <h3 className="text-lg font-semibold mb-3">Local Export</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4" onClick={() => exportAsCsv(tasks, baseFileName)}>
                    <Download className="mr-2" />
                    Download .csv
                </Button>
                 <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4" onClick={() => exportAsJson(tasks, baseFileName)}>
                    <Download className="mr-2" />
                    Download .json
                </Button>
                 <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4" onClick={() => exportAsMarkdown(tasks, baseFileName)}>
                    <Download className="mr-2" />
                    Download .md
                </Button>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="mr-2 h-4 w-4" />Back to Preview</Button>
        <Button onClick={reset}><History className="mr-2 h-4 w-4" />Start Over</Button>
      </CardFooter>
    </Card>
  );
}
