import { getRandomString } from "@oh/utils";

type Account = {
  accountId: string;
  username: string;
  admin: boolean;
  languages: string[];

  token?: string;
};

export const accounts = () => {
  let accountMap: Record<string, Account> = {};

  const set = (fingerprint: string, account: Account) => {
    account.token = getRandomString(64);
    accountMap[fingerprint] = account;
    return account.token;
  };

  const get = (fingerprint: string, token: string) => {
    const account = { ...accountMap[fingerprint] };

    if (account.token !== token) return null;

    delete account.token;
    return account;
  };

  return {
    set,
    get,
  };
};
