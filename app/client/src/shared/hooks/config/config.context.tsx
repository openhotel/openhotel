import React from "react";
import { ConfigTypes } from "shared/types";

export type ConfigState = {
  getConfig: () => ConfigTypes;
  getVersion: () => string;
  getLastVersion: () => string;

  isDevelopment: () => boolean;
};

export const ConfigContext = React.createContext<ConfigState>(undefined);
