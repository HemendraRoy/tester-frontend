import { create } from 'zustand';
import { db } from '../db';
import type { Folder } from '../types';
import { generateId } from '../utils/id';

interface FolderState {
  folders: Folder[];
  isLoaded: boolean;
  loadFolders: () => Promise<void>;
  addFolder: (name: string, parentId: string | null) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Pick<Folder, 'name' | 'parentId'>>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  getChildFolders: (parentId: string | null) => Folder[];
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  isLoaded: false,

  loadFolders: async () => {
    const folders = await db.folders.toArray();
    set({ folders, isLoaded: true });
  },

  addFolder: async (name, parentId) => {
    const folder: Folder = {
      id: generateId(),
      name,
      parentId,
    };
    await db.folders.add(folder);
    set((state) => ({ folders: [...state.folders, folder] }));
    return folder;
  },

  updateFolder: async (id, updates) => {
    await db.folders.update(id, updates);
    set((state) => ({
      folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  },

  deleteFolder: async (id) => {
    const deleteRecursive = async (folderId: string) => {
      const childFolders = get().folders.filter((f) => f.parentId === folderId);
      for (const child of childFolders) {
        await deleteRecursive(child.id);
      }
      const { useRequestStore } = await import('./requestStore');
      const requests = useRequestStore.getState().requests.filter((r) => r.folderId === folderId);
      for (const req of requests) {
        await useRequestStore.getState().deleteRequest(req.id);
      }
      await db.folders.delete(folderId);
    };

    await deleteRecursive(id);
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id && !isDescendant(state.folders, f.id, id)),
    }));
  },

  getChildFolders: (parentId) => {
    return get().folders.filter((f) => f.parentId === parentId);
  },
}));

function isDescendant(folders: Folder[], folderId: string, ancestorId: string): boolean {
  let current = folders.find((f) => f.id === folderId);
  while (current) {
    if (current.parentId === ancestorId) return true;
    current = current.parentId ? folders.find((f) => f.id === current!.parentId) : undefined;
  }
  return false;
}
