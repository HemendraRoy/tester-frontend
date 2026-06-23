import { create } from 'zustand';
import { db } from '../db';
import type { Request } from '../types';
import { generateId } from '../utils/id';

interface RequestState {
  requests: Request[];
  isLoaded: boolean;
  loadRequests: () => Promise<void>;
  addRequest: (folderId: string, name?: string) => Promise<Request>;
  updateRequest: (id: string, updates: Partial<Omit<Request, 'id' | 'createdAt'>>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  moveRequest: (requestId: string, targetFolderId: string) => Promise<void>;
  getRequestsByFolder: (folderId: string) => Request[];
}

const createEmptyRequest = (folderId: string, name = 'Untitled Request'): Request => ({
  id: generateId(),
  folderId,
  name,
  method: 'GET',
  url: '',
  params: [{ key: '', value: '' }],
  headers: [{ key: '', value: '' }],
  body: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  isLoaded: false,

  loadRequests: async () => {
    const requests = await db.requests.toArray();
    set({ requests, isLoaded: true });
  },

  addRequest: async (folderId, name) => {
    const request = createEmptyRequest(folderId, name);
    await db.requests.add(request);
    set((state) => ({ requests: [...state.requests, request] }));
    return request;
  },

  updateRequest: async (id, updates) => {
    const updatedAt = Date.now();
    await db.requests.update(id, { ...updates, updatedAt });
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt } : r,
      ),
    }));
  },

  deleteRequest: async (id) => {
    await db.requests.delete(id);
    set((state) => ({ requests: state.requests.filter((r) => r.id !== id) }));
    const { useActiveRequestStore } = await import('./activeRequestStore');
    const activeId = useActiveRequestStore.getState().activeRequestId;
    if (activeId === id) {
      useActiveRequestStore.getState().setActiveRequest(null);
    }
  },

  moveRequest: async (requestId, targetFolderId) => {
    await get().updateRequest(requestId, { folderId: targetFolderId });
  },

  getRequestsByFolder: (folderId) => {
    return get().requests.filter((r) => r.folderId === folderId);
  },
}));

export { createEmptyRequest };
