import { account } from "system/account";

export const System = (() => {
  const $account = account();

  return {
    account: $account,
  };
})();
