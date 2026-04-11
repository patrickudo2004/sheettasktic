import { Task } from '../types';

export type SyncResult = {
  success: boolean;
  syncedCount: number;
  error?: string;
  providerId: string;
};

export interface SyncProvider {
  id: string;
  name: string;
  icon: string; // Lucide icon name or SVG path
  description: string;
  
  /**
   * Syncs the provided tasks to the target platform.
   * Assumes the user is already authenticated for this provider.
   */
  sync(tasks: Task[]): Promise<SyncResult>;

  /**
   * Checks if the user is authenticated with this provider.
   */
  isConnected(): boolean;

  /**
   * Initiates the connection/OAuth flow for this provider.
   */
  connect(): Promise<void>;

  /**
   * Clean up and disconnect.
   */
  disconnect(): Promise<void>;
}

export class SyncProviderError extends Error {
  constructor(public providerId: string, message: string) {
    super(`[${providerId}] Sync failed: ${message}`);
    this.name = 'SyncProviderError';
  }
}
