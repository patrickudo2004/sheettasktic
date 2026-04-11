import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class NotionAdapter implements SyncProvider {
  id = 'notion';
  name = 'Notion';
  icon = 'notion';
  description = 'Sync your tasks to a Notion Database. (Requires an Internal Integration Token)';

  private token: string | null = null;
  private databaseId: string | null = null;

  isConnected(): boolean {
    return !!this.token && !!this.databaseId;
  }

  // For Notion, we'll store the credentials in local storage for now
  async connect(): Promise<void> {
    // This will be handled by the UI showing a dialog to input token/DB ID
    // The UI will call an internal setCredentials method
    return Promise.resolve();
  }

  setCredentials(token: string, databaseId: string) {
    this.token = token;
    this.databaseId = databaseId;
    localStorage.setItem('notion_token', token);
    localStorage.setItem('notion_db_id', databaseId);
  }

  async disconnect(): Promise<void> {
    this.token = null;
    this.databaseId = null;
    localStorage.removeItem('notion_token');
    localStorage.removeItem('notion_db_id');
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.token || !this.databaseId) {
      throw new Error("Notion is not connected. Please provide token and database ID.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      try {
        // Notion API requires a proxy or server-side call because of CORS
        // We will implement an API route in Next.js for this
        const response = await fetch('/api/sync/notion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: this.token,
            databaseId: this.databaseId,
            task: {
              title: task.title,
              content: task.notes || '',
              dueDate: task.dueDate,
              priority: task.priority
            }
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Notion page:", errorData);
        }
      } catch (e) {
        console.error("Error creating Notion task:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} tasks to Notion.`
    };
  }
}
