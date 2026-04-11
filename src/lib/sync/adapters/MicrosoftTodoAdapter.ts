import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class MicrosoftTodoAdapter implements SyncProvider {
  id = 'microsoft-todo';
  name = 'Microsoft To-Do';
  icon = 'microsoft';
  description = 'Sync your tasks to your Microsoft To-Do lists (Outlook Tasks).';

  private accessToken: string | null = null;
  private listId: string = 'tasks'; // Default list

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connect(): Promise<void> {
    // This will involve redirecting to Microsoft OAuth
    // For now, we'll mark the logic for implementation with MS Graph
    console.log("Initiating Microsoft Login...");
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
      throw new Error("Microsoft To-Do is not connected.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      try {
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${this.listId}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: task.title,
            body: {
              content: task.notes || '',
              contentType: 'text'
            },
            dueDateTime: task.dueDate ? {
                dateTime: task.dueDate,
                timeZone: 'UTC'
            } : undefined,
            importance: task.priority === 'high' ? 'high' : 'normal'
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Microsoft task:", errorData);
        }
      } catch (e) {
        console.error("Error creating Microsoft task:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} tasks.`
    };
  }
}
