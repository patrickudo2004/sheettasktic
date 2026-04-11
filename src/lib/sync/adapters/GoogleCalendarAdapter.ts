import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';
import { GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';

export class GoogleCalendarAdapter implements SyncProvider {
  id = 'google-calendar';
  name = 'Google Calendar';
  icon = 'calendar';
  description = 'Turn your tasks into scheduled events on your Google Calendar.';

  private accessToken: string | null = null;

  constructor(private auth: Auth) {}

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connect(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      const result = await signInWithPopup(this.auth, provider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (!token) {
        throw new Error("Could not retrieve access token from Google.");
      }

      this.accessToken = token;
    } catch (error: any) {
      console.error("Google Calendar connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.accessToken = null;
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.accessToken) {
      throw new Error("Google Calendar is not connected.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      const startDateTime = this.parseToISODate(task.dueDate) || new Date().toISOString();
      // Default to 1 hour event
      const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

      try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: task.title,
            description: task.notes,
            start: { dateTime: startDateTime },
            end: { dateTime: endDateTime }
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Google Calendar event:", errorData);
        }
      } catch (e) {
        console.error("Error creating Calendar event:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} events.`
    };
  }

  private parseToISODate(dateString: string | undefined): string | undefined {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }
}
