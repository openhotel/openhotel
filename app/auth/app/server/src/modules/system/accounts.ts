import { System } from "modules/system/main.ts";
import { Account } from "shared/types/account.types.ts";

export const accounts = () => {
  const getList = async () =>
    (await System.db.list({ prefix: ["accounts"] })).map(({ value }) => value);

  const getFromRequest = async ({ headers }: Request) => {
    let accountId = headers.get("account-id");
    const connectionToken = headers.get("connection-token");

    if (!accountId && connectionToken) {
      const connection =
        await System.connections.getConnectionByRawToken(connectionToken);
      accountId = connection.accountId;
    }

    return await get(accountId);
  };

  const get = async (accountId: string): Promise<Account | undefined> => {
    return await System.db.get(["accounts", accountId]);
  };

  return {
    getList,
    get,
    getFromRequest,
  };
};
