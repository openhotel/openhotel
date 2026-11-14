import { create } from "zustand";
import { Account } from "shared/types";

export const useAccountStore = create<{
  account: Account;
  set: (account: Account) => void;
}>((set) => ({
  account: null,
  set: (account: Account) => set({ account }),
}));
