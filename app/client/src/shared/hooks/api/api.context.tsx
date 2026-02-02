import React from "react";

export type ApiState = {
  fetch: (
    pathname: string,
    data?: Record<string | number, string | number | boolean>,
    ignoreStatus?: boolean,
    method?: string,
  ) => Promise<unknown>;

  getPath: (pathname: string) => string;
};

export const ApiContext = React.createContext<ApiState>(undefined);
