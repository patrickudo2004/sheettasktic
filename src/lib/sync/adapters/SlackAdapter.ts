import { Task } from '../../types';
import { SyncProvider, SyncResult } from '../SyncProvider';

export class SlackAdapter implements SyncProvider {
  id = 'slack';
  name = 'Slack';
  icon = 'message-square';
  description = 'Send a notification to Slack when your sync is finished.';

  private webhookUrl: string | null = null;

  isConnected(): boolean {
    return !!this.webhookUrl;
  }

  async connect(): Promise<void> {
    // For Slack, we'll use a Webhook URL for simplicity
    console.log("Slack uses Webhook URL configuration.");
    return Promise.resolve();
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }

  async disconnect(): Promise<void> {
    this.webhookUrl = null;
  }

  async sync(tasks: Task[]): Promise<SyncResult> {
    if (!this.webhookUrl) {
      throw new Error("Slack Webhook URL is not configured.");
    }

    const taskCount = tasks.filter(t => t && t.title).length;

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: `🚀 *SheetTasktic Sync Complete!*`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "🚀 *SheetTasktic Sync Complete!*"
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Total Tasks Mapped:*\n${taskCount}`
                },
                {
                  type: "mrkdwn",
                  text: `*Status:*\nSuccess ✅`
                }
              ]
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: "Imported from your Spreadsheet via SheetTasktic."
                }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        return {
          success: true,
          syncedCount: taskCount,
          providerId: this.id
        };
      } else {
        const errorText = await response.text();
        throw new Error(`Slack notification failed: ${errorText}`);
      }
    } catch (e: any) {
      return {
        success: false,
        syncedCount: 0,
        providerId: this.id,
        error: e.message
      };
    }
  }
}
