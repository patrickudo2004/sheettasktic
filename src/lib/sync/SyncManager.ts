import { Task } from '../types';
import { SyncProvider, SyncResult } from './SyncProvider';

export interface SyncProgress {
  total: number;
  completed: number;
  remaining: number;
  failed: number;
  percent: number;
}

export class SyncManager {
  private concurrency: number = 5;
  private delayBetweenBatches: number = 200; // ms

  constructor(concurrency = 5) {
    this.concurrency = concurrency;
  }

  /**
   * Syncs tasks with a provider using controlled concurrency.
   */
  async sync(
    provider: SyncProvider, 
    tasks: Task[], 
    onProgress?: (progress: SyncProgress) => void
  ): Promise<SyncResult> {
    const validTasks = tasks.filter(t => t && t.title);
    const total = validTasks.length;
    let completed = 0;
    let failed = 0;

    const updateProgress = () => {
      if (onProgress) {
        onProgress({
          total,
          completed,
          remaining: total - (completed + failed),
          failed,
          percent: Math.round(((completed + failed) / total) * 100)
        });
      }
    };

    // Process in chunks
    for (let i = 0; i < total; i += this.concurrency) {
      const chunk = validTasks.slice(i, i + this.concurrency);
      
      // We manually implement the specific provider's sync logic here 
      // but in a parallelized way.
      // NOTE: Most providers currently have a .sync(tasks[]) method.
      // To support fine-grained progress, we either need providers to sync one-by-one
      // or we sync the chunk as one batch.
      
      // Let's call the provider's sync for the chunk
      try {
        const result = await provider.sync(chunk);
        completed += result.syncedCount;
        failed += (chunk.length - result.syncedCount);
      } catch (err) {
        failed += chunk.length;
        console.error(`Batch sync failed for ${provider.name}:`, err);
      }

      updateProgress();
      
      // Rate limiting delay
      if (i + this.concurrency < total) {
        await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
      }
    }

    return {
      success: completed > 0,
      syncedCount: completed,
      providerId: provider.id,
      error: failed > 0 ? `Synced ${completed} tasks. ${failed} failed due to errors.` : undefined
    };
  }
}
