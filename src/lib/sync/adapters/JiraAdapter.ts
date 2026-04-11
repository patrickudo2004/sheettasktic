import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class JiraAdapter implements SyncProvider {
  id = 'jira';
  name = 'Jira Cloud';
  icon = 'settings'; // We'll map to a Jira-like icon in UI
  description = 'Sync tasks as issues in your Jira Cloud projects.';

  private accessToken: string | null = null;
  private siteId: string | null = null;
  private projectKey: string = '';
  private issueType: string = 'Task';

  isConnected(): boolean {
    return !!this.accessToken && !!this.siteId;
  }

  async connect(): Promise<void> {
    // This will involve Atlassian OAuth 2.0 (3LO)
    console.log("Initiating Jira Login...");
    return Promise.resolve();
  }

  setCredentials(token: string, siteId: string, projectKey: string) {
    this.accessToken = token;
    this.siteId = siteId;
    this.projectKey = projectKey;
  }

  async disconnect(): Promise<void> {
    this.accessToken = null;
    this.siteId = null;
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.accessToken || !this.siteId) {
      throw new Error("Jira is not connected correctly.");
    }

    if (!this.projectKey) {
        throw new Error("Jira Project Key is required.");
    }

    const validTasks = tasks.filter(task => task && task.title);
    let successCount = 0;

    for (const task of validTasks) {
      try {
        const response = await fetch(`https://api.atlassian.com/ex/jira/${this.siteId}/rest/api/3/issue`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
                project: {
                    key: this.projectKey
                },
                summary: task.title,
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: task.notes || "Imported from SheetTasktic"
                                }
                            ]
                        }
                    ]
                },
                issuetype: {
                    name: this.issueType
                }
            }
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error("Failed to create Jira issue:", errorData);
        }
      } catch (e) {
        console.error("Error creating Jira issue:", e);
      }
    }

    return {
      success: successCount > 0,
      syncedCount: successCount,
      providerId: this.id,
      error: successCount === validTasks.length ? undefined : `Successfully synced ${successCount} of ${validTasks.length} issues.`
    };
  }
}
