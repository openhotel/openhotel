import { create } from "zustand";
import { GameProps } from "shared/hooks/game/game.context";

export const useGameStore = create<{
  id: string | null;
  token: string | null;
  props: GameProps | null;

  set: (id: string, token: string, props: GameProps) => void;
  clear: () => void;
  getProps: () => GameProps;
}>((set, get) => ({
  id: null,
  token: null,
  props: null,
  set: (id, token, props) =>
    set((store) => ({
      ...store,
      id,
      token,
      props,
    })),
  clear: () =>
    set((store) => ({
      ...store,
      id: null,
      token: null,
      props: null,
    })),
  getProps: () => get().props,
}));
