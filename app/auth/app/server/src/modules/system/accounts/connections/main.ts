import {
  AccountConnections,
  DbAccount,
  DbAccountIntegrationConnection,
} from "shared/types/account.types.ts";
import { System } from "modules/system/main.ts";
import { active } from "modules/system/accounts/connections/active.ts";

export const connections = (account: DbAccount): AccountConnections => {
  const $active = active(account);

  const getConnections = async (): Promise<
    DbAccountIntegrationConnection[]
  > => {
    const { items } = await System.db.list({
      prefix: ["integrationConnectionByAccountId", account.accountId],
    });
    return items.map(({ value }) => value);
  };

  const getConnection = async (hotelId: string, integrationId: string) => {
    return System.db.get([
      "integrationConnectionByAccountId",
      account.accountId,
      hotelId,
      integrationId,
    ]);
  };

  const remove = async (hotelId: string, integrationId: string) => {
    await System.db.delete([
      "integrationConnectionByAccountId",
      account.accountId,
      hotelId,
      integrationId,
    ]);

    if (!(await $active.check(hotelId, integrationId))) return;
    await $active.remove();
  };

  const removeAll = async () => {
    await $active.remove();

    for (const connection of await getConnections())
      await System.db.delete([
        "integrationConnectionByAccountId",
        account.accountId,
        connection.hotelId,
        connection.integrationId,
      ]);
  };

  return {
    getConnections,
    getConnection,

    remove,
    removeAll,

    active: $active,
  };
};
