import { create } from "zustand";
import { Route } from "shared/enums";

export const useRouterStore = create<{
  route: Route;
  data: unknown;
  navigate: (route: Route, data?: unknown) => void;
}>((set) => ({
  route: Route.HOME,
  data: null,
  navigate: (route: Route, data) => set({ route, data: data ?? null }),
}));
