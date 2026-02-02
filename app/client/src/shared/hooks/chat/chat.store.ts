import { create } from "zustand";

export const useChatStore = create<{
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}>((set) => ({
  enabled: true,
  setEnabled: (enabled: boolean) =>
    set({
      enabled,
    }),
}));
