import { System } from "modules/system/main.ts";

export const admins = () => {
  const getList = async () => {
    const { items } = await System.db.list({ prefix: ["adminsByAccountId"] });
    return items.map(({ value }) => value);
  };

  const get = async (accountId: string) => {
    return await System.db.get(["adminsByAccountId", accountId]);
  };

  const set = async (accountId: string) => {
    await System.db.set(["adminsByAccountId", accountId], accountId);
  };

  const remove = async (accountId: string) => {
    await System.db.delete(["adminsByAccountId", accountId]);
  };

  return {
    getList,
    get,
    set,
    remove,
  };
};
