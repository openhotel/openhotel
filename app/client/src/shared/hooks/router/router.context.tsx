import React from "react";
import { Route } from "shared/enums";

export type RouterState = {
  navigate: (route: Route, data?: unknown) => void;
};

export const RouterContext = React.createContext<RouterState>(undefined);
