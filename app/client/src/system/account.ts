import { Account } from "shared/types";

export const account = () => {
  let $account: Account = null;

  const setAccount = (account: Account) => {
    $account = account;
  };

  const getAccount = () => $account;

  return {
    setAccount,
    getAccount,
  };
};
