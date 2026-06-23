import { create } from 'zustand';
import { db, SETTINGS_ID } from '../db';
import type { ContextMenuState } from '../types';

interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  contextMenu: ContextMenuState | null;
  renamingId: string | null;
  expandedFolders: Set<string>;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  toggleSidebar: () => void;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setRenamingId: (id: string | null) => void;
  toggleFolderExpanded: (folderId: string) => void;
  expandFolder: (folderId: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  sidebarCollapsed: false,
  contextMenu: null,
  renamingId: null,
  expandedFolders: new Set<string>(),
  isInitialized: false,

  initialize: async () => {
    const settings = await db.settings.get(SETTINGS_ID);
    if (settings) {
      set({
        theme: settings.theme,
        sidebarCollapsed: settings.sidebarCollapsed,
        isInitialized: true,
      });
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');

      const { useActiveRequestStore } = await import('./activeRequestStore');
      if (settings.activeRequestId) {
        useActiveRequestStore.getState().setActiveRequest(settings.activeRequestId);
      }
      if (settings.activeTab) {
        useActiveRequestStore.getState().setActiveTab(settings.activeTab);
      }
    } else {
      set({ isInitialized: true });
      document.documentElement.classList.add('dark');
    }
  },

  toggleTheme: async () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    await get().setTheme(newTheme);
  },

  setTheme: async (theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
    await db.settings.update(SETTINGS_ID, { theme });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setContextMenu: (menu) => set({ contextMenu: menu }),

  setRenamingId: (id) => set({ renamingId: id }),

  toggleFolderExpanded: (folderId) => {
    set((state) => {
      const next = new Set(state.expandedFolders);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return { expandedFolders: next };
    });
  },

  expandFolder: (folderId) => {
    set((state) => {
      const next = new Set(state.expandedFolders);
      next.add(folderId);
      return { expandedFolders: next };
    });
  },
}));

export async function persistUIState(): Promise<void> {
  const { useActiveRequestStore } = await import('./activeRequestStore');
  const { activeRequestId, activeTab } = useActiveRequestStore.getState();
  await db.settings.update(SETTINGS_ID, { activeRequestId, activeTab });
}
