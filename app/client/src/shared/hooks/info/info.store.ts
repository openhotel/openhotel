import { create } from "zustand";

export const useInfoStore = create<{
  extra: string[];
  setExtra: (extra: string[]) => void;
  clearExtra: () => void;
}>((set) => ({
  extra: [],
  setExtra: (extra: string[]) =>
    set({
      extra,
    }),
  clearExtra: () =>
    set({
      extra: [],
    }),
}));
