import { create } from "zustand";

interface ChatStore {
  newMessageReceived: boolean;
  setNewMessageReceived: (status: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  newMessageReceived: false,
  setNewMessageReceived: (status) => set({ newMessageReceived: status }),
}));
