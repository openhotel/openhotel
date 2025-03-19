import React from "react";
import { Account } from "shared/types";

export type AccountState = {
  getAccount: () => Account;
};

export const AccountContext = React.createContext<AccountState>(undefined);
