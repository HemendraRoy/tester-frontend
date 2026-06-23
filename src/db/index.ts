import Dexie, { type EntityTable } from 'dexie';
import type { Folder, Request, UISettings } from '../types';

class TesterDatabase extends Dexie {
  folders!: EntityTable<Folder, 'id'>;
  requests!: EntityTable<Request, 'id'>;
  settings!: EntityTable<UISettings & { id: string }, 'id'>;

  constructor() {
    super('TesterDB');

    this.version(1).stores({
      folders: 'id, parentId, name',
      requests: 'id, folderId, name, updatedAt',
      settings: 'id',
    });
  }
}

export const db = new TesterDatabase();

export const SETTINGS_ID = 'app-settings';

export async function initializeDatabase(): Promise<void> {
  const existingSettings = await db.settings.get(SETTINGS_ID);
  if (!existingSettings) {
    await db.settings.put({
      id: SETTINGS_ID,
      theme: 'dark',
      sidebarCollapsed: false,
      activeRequestId: null,
      activeTab: 'params',
    });
  }
}
