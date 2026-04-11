import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class HubSpotAdapter implements SyncProvider {
  id = 'hubspot';
  name = 'HubSpot';
  icon = 'globe'; // Will map to HubSpot icon
  description = 'Sync your tasks as CRM engagements in HubSpot.';

  private accessToken: string | null = null;

  isConnected(): boolean {
    return !!this.accessToken;
  }

  async connect(): Promise<void> {
    // This will involve HubSpot OAuth 2.0
    console.log("Initiating HubSpot Login...");
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
      throw new Error("HubSpot is not connected.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      try {
        const response = await fetch('https://api.hubapi.com/crm/v3/objects/tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties: {
                hs_task_subject: task.title,
                hs_task_body: task.notes || '',
                hs_task_status: 'NOT_STARTED',
                hs_task_priority: task.priority === 'high' ? 'HIGH' : 'MEDIUM',
                // HubSpot expects Unix timestamp in milliseconds for some fields, or ISO for others.
                // The Tasks API v3 uses a string/ISO for hs_timestamp
                hs_timestamp: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString()
            }
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create HubSpot task:", errorData);
        }
      } catch (e) {
        console.error("Error creating HubSpot task:", e);
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
