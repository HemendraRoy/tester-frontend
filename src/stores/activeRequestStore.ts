import { create } from 'zustand';
import type { EditorTab, ResponseState } from '../types';

interface ActiveRequestState {
  activeRequestId: string | null;
  activeTab: EditorTab;
  response: ResponseState | null;
  isSending: boolean;
  setActiveRequest: (id: string | null) => void;
  setActiveTab: (tab: EditorTab) => void;
  setResponse: (response: ResponseState | null) => void;
  setIsSending: (sending: boolean) => void;
  clearResponse: () => void;
}

export const useActiveRequestStore = create<ActiveRequestState>((set) => ({
  activeRequestId: null,
  activeTab: 'params',
  response: null,
  isSending: false,

  setActiveRequest: (id) => set({ activeRequestId: id, response: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setResponse: (response) => set({ response }),
  setIsSending: (sending) => set({ isSending: sending }),
  clearResponse: () => set({ response: null }),
}));
