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

  const remove = async (accountId: string) => {
    const account = await get(accountId);

    await System.db.delete(["accounts", accountId]);
    await System.db.delete(["accountsByEmail", account.emailHash]);
    await System.db.delete(["accountsByRefreshToken", accountId]);
    await System.db.delete(["accountsByToken", accountId]);
    await System.db.delete(["accountsByUsername", account.username]);

    await System.db.delete(["emailsByHash", account.emailHash]);

    await System.db.delete(["github", accountId]);
    await System.db.delete(["githubState", accountId]);

    await System.connections.removeAll(accountId);
    await System.hotels.removeAll(accountId);

    await System.db.delete(["hotelsByAccountId", accountId]);

    await System.admins.remove(accountId);
  };

  return {
    getList,
    get,
    getFromRequest,
    remove,
  };
};
