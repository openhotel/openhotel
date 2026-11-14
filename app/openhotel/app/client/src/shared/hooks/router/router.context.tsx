import React from "react";
import { Route } from "shared/enums";

export type RouterState = {
  navigate: (route: Route, data?: unknown) => void;
  getRoute: () => Route;
};

export const RouterContext = React.createContext<RouterState>(undefined);
