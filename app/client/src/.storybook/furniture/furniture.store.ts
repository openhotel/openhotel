import { create } from "zustand";
import { FurnitureData } from "../../shared/types";

export const useFurnitureStore = create<{
  furniture: Record<string, FurnitureData>;
  add: (furniture: FurnitureData) => void;
  get: (furnitureId: string) => FurnitureData;
}>((set, get) => ({
  furniture: {},
  add: (furniture: FurnitureData) =>
    set((store) => ({
      ...store,
      furniture: {
        ...store.furniture,
        [furniture.furnitureId]: furniture,
      },
    })),
  get: (furnitureId: string) => get().furniture[furnitureId] ?? null,
}));
