import { create } from "zustand";
import React from "react";
import { HomeComponent } from "modules/home";

export const useRouterStore = create<{
  component: React.FC;
  navigate: (component: React.FC) => void;
}>((set) => ({
  component: HomeComponent,
  navigate: (component: React.FC) => set({ component }),
}));
