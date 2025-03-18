import React from "react";
import { ConfigTypes } from "shared/types";

export type ConfigState = {
  getChangeLog: () => unknown;
  getConfig: () => ConfigTypes;
};

export const ConfigContext = React.createContext<ConfigState>(undefined);
