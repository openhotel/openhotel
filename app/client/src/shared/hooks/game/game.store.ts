import { create } from "zustand";
import { GameProps } from "shared/hooks/game/game.context";

export const useGameStore = create<{
  id: string | null;
  name: string | null;
  token: string | null;
  props: GameProps | null;

  set: (id: string, name: string, token: string, props: GameProps) => void;
  clear: () => void;
  getProps: () => GameProps;
}>((set, get) => ({
  id: null,
  name: null,
  token: null,
  props: null,
  set: (id, name, token, props) =>
    set((store) => ({
      ...store,
      id,
      name,
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
