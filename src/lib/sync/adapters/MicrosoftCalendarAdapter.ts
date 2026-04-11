import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class MicrosoftCalendarAdapter implements SyncProvider {
  id = 'microsoft-calendar';
  name = 'Microsoft Calendar';
  icon = 'calendar';
  description = 'Sync your tasks as events on your Outlook/Microsoft Calendar.';

  private accessToken: string | null = null;

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connect(): Promise<void> {
    // This will involve Microsoft OAuth
    console.log("Initiating Microsoft Calendar Login...");
    return Promise.resolve();
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async disconnect(): Promise<void> {
    this.accessToken = null;
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.accessToken) {
      throw new Error("Microsoft Calendar is not connected.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      const startDateTime = task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString();
      const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

      try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subject: task.title,
            body: {
              contentType: 'text',
              content: task.notes || ''
            },
            start: {
              dateTime: startDateTime,
              timeZone: 'UTC'
            },
            end: {
              dateTime: endDateTime,
              timeZone: 'UTC'
            }
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Microsoft Calendar event:", errorData);
        }
      } catch (e) {
        console.error("Error creating Microsoft Calendar event:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} events.`
    };
  }
}
