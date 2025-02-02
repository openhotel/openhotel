import { Migration, DbMutable } from "@oh/utils";

const convertKey = (db) => async (key1: string, key2: string) => {
  const list = await db.list({
    prefix: [key1],
  });

  for await (const { key, value } of list) {
    const targetKey = [...key];
    targetKey[0] = key2;
    await db.set(targetKey, value);

    await db.delete(key);
  }
};

export default {
  id: "2025-01-31--10-51-refactor-part-2",
  description: `refactor part-2`,
  up: async (db: DbMutable) => {
    const deleteAll = async (key: string) => {
      const list = await db.list({
        prefix: [key],
      });

      for await (const { key } of list) await db.delete(key);
    };
    const $convertKey = convertKey(db);

    //integrationsByAccountId -> integrationConnectionByAccountId
    await $convertKey(
      "integrationsByAccountId",
      "integrationConnectionByAccountId",
    );
    //accountByConnectionId -> accountByActiveIntegrationConnectionId
    await $convertKey(
      "accountByConnectionId",
      "accountByActiveIntegrationConnectionId",
    );

    //remove to make room
    // >> connections -> activeIntegrationConnectionByAccountId
    // >> accountByConnectionId -> accountByActiveIntegrationConnectionId
    await deleteAll("connections");
    await deleteAll("accountByConnectionId");
  },
  down: async (db: DbMutable) => {
    const $convertKey = convertKey(db);

    //integrationConnectionByAccountId -> integrationsByAccountId
    await $convertKey(
      "integrationConnectionByAccountId",
      "integrationsByAccountId",
    );
    //accountByActiveIntegrationConnectionId -> accountByConnectionId
    await $convertKey(
      "accountByActiveIntegrationConnectionId",
      "accountByConnectionId",
    );
  },
} as Migration;
