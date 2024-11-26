import { System } from "modules/system/main.ts";

export const hosts = () => {
  const getList = async () =>
    await Promise.all(
      (await System.db.list({ prefix: ["hosts"] })).map(({ key }) =>
        get(key[1]),
      ),
    );

  const get = async (hostname: string) => {
    const host = await System.db.get(["hosts", hostname]);
    const accounts = (
      await System.db.list({
        prefix: ["hostsByHostname", hostname],
      })
    ).map(({ key }) => key[2]);

    return {
      hostname,
      accounts,
      verified: host?.verified ?? false,
    };
  };

  const getListByAccountId = async (accountId: string) => {
    const connectionByAccountId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);
    let hostname = null;
    if (connectionByAccountId) {
      const connection = await System.db.get([
        "connections",
        connectionByAccountId.connectionId,
      ]);
      hostname = connection?.hostname;
    }

    return await Promise.all(
      (
        await System.db.list({
          prefix: ["hostsByAccountId", accountId],
        })
      ).map(async ({ value }) => {
        const data = await get(value.hostname);
        return {
          ...value,
          accounts: data.accounts.length,
          isActive: value.hostname === hostname,
        };
      }),
    );
  };

  return {
    getList,
    get,
    getListByAccountId,
  };
};
