import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';
import { GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';

export class GoogleTasksAdapter implements SyncProvider {
  id = 'google-tasks';
  name = 'Google Tasks';
  icon = 'google-tasks'; // We'll handle icons in the UI
  description = 'Sync your tasks directly to your primary Google Tasks list.';

  private accessToken: string | null = null;

  constructor(private auth: Auth) {}

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connect(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/tasks');
      const result = await signInWithPopup(this.auth, provider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (!token) {
        throw new Error("Could not retrieve access token from Google.");
      }

      this.accessToken = token;
      // Optional: Store in local storage or session for persistence
    } catch (error: any) {
      console.error("Google Tasks connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.accessToken = null;
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.accessToken) {
      throw new Error("Google Tasks is not connected. Please connect first.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      const taskPayload = {
        title: task.title,
        notes: task.notes,
        due: this.parseDateToRFC3339(task.dueDate),
      };

      try {
        const response = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskPayload)
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Google task:", errorData);
        }
      } catch (e) {
        console.error("Error creating Google task:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} tasks.`
    };
  }

  private parseDateToRFC3339(dateString: string | undefined): string | undefined {
    if (!dateString) return undefined;
    try {
      let date;
      if (!isNaN(Number(dateString)) && Number(dateString) > 25569) {
        date = new Date(Math.round((Number(dateString) - 25569) * 86400 * 1000));
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString();
    } catch (e) {
      return undefined;
    }
  }
}
