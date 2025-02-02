import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-30--23-47-refactor",
  description: `refactor`,
  up: async (db: DbMutable) => {
    const deleteAll = async (key: string) => {
      const list = await db.list({
        prefix: [key],
      });

      for await (const { key } of list) await db.delete(key);
    };

    //delete everything in hotelsByAccountId
    await deleteAll("hotelsByAccountId");
    //delete everything in integrationsByHotelsByAccountId
    await deleteAll("integrationsByHotelsByAccountId");
    //delete everything in servers
    await deleteAll("servers");
    //delete everything in serversByHostname
    await deleteAll("serversByHostname");
    //delete everything in serversByHostname
    await deleteAll("accountOTP");
    //delete everything in tokens
    await deleteAll("tokens");
    //delete serverByHostname
    await deleteAll("serverByHostname");

    //delete onet connection
    await db.delete(["onetConnection"]);

    //delete non active otp
    for await (const { key, value } of await db.list({
      prefix: ["otpByAccountId"],
    })) {
      if (value.verified) continue;

      await db.delete(key);
    }

    const githubList = await db.list({
      prefix: ["github"],
    });

    for await (const { key, value } of githubList) {
      const accountKey = ["accounts", key[1]];
      const account = await db.get(accountKey);
      await db.set(accountKey, {
        ...account,
        githubLogin: value,
        updatedAt: Date.now(),
      });
    }
  },
  down: async (db: DbMutable) => {
    const accountList = await db.list({
      prefix: ["accounts"],
    });

    for await (let { account } of accountList) {
      const accountKey = ["accounts", account.accountId];
      await db.set(["github", account.accountId], account.githubLogin);

      delete account.githubLogin;
      await db.set(accountKey, {
        ...account,
        updatedAt: Date.now(),
      });
    }
  },
} as Migration;
