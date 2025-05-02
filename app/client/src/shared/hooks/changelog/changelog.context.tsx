import React from "react";

export type ChangelogState = {
  getChangeLog: () => unknown;
};

export const ChangelogContext = React.createContext<ChangelogState>(undefined);
