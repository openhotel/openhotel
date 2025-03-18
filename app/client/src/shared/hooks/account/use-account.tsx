import { useContext } from "react";
import { AccountContext, AccountState } from "./account.context";

export const useAccount = (): AccountState => useContext(AccountContext);
