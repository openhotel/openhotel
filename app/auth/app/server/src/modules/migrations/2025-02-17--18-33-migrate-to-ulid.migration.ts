import { Migration, DbMutable } from "@oh/utils";
import { ulid } from "@std/ulid";

export default {
  id: "2025-02-17--18-33-migrate-to-ulid",
  description: `Migration to ULID instead of UUID`,
  up: async (db: DbMutable) => {
    const $accountMap: Record<string, string> = {};
    const $hotelMap: Record<string, string> = {};
    const $integrationsMap: Record<string, string> = {};

    const { items: accountsByUsername } = await db.list({
      prefix: ["accountsByUsername"],
    });
    for (const { key } of accountsByUsername) {
      await db.delete(key);
    }

    const { items: accounts } = await db.list({
      prefix: ["accounts"],
    });
    for (const { key, value: account } of accounts) {
      const $oldId = account.accountId;
      $accountMap[$oldId] = ulid(account.createdAt);
      account.accountId = $accountMap[$oldId];

      await db.set(["accounts", account.accountId], account);
      await db.delete(key);

      //'accountsByUsername'
      await db.set(
        ["accountsByUsername", account.username.toLowerCase()],
        account.accountId,
      );

      if (await db.get(["adminsByAccountId", $oldId])) {
        //'adminsByAccountId'
        await db.delete(["adminsByAccountId", $oldId]);
        await db.set(
          ["adminsByAccountId", account.accountId],
          account.accountId,
        );
      }

      //'otpByAccountId'
      const otp = await db.get(["otpByAccountId", $oldId]);
      if (otp) {
        await db.delete(["otpByAccountId", $oldId]);
        await db.set(["otpByAccountId", account.accountId], otp);
      }

      // 'accountsByGithubLogin'
      if (account.githubLogin) {
        await db.set(
          ["accountsByGithubLogin", account.githubLogin],
          account.accountId,
        );
      }
    }

    const { items: accountsByEmail } = await db.list({
      prefix: ["accountsByEmail"],
    });
    for (const { key, value: accountId } of accountsByEmail) {
      await db.set(key, $accountMap[accountId]);
    }

    const { items: hotels } = await db.list({
      prefix: ["hotels"],
    });
    for (const { key, value: hotel } of hotels) {
      const $oldId = hotel.hotelId;
      $hotelMap[$oldId] = ulid(hotel.createdAt);
      hotel.hotelId = $hotelMap[$oldId];
      hotel.accountId = $accountMap[hotel.accountId];

      for (const integration of hotel.integrations) {
        $integrationsMap[integration.integrationId] = ulid(hotel.createdAt);
        integration.integrationId = $integrationsMap[integration.integrationId];
      }

      await db.set(["hotels", hotel.hotelId], hotel);
      await db.delete(key);
    }

    const { items } = await db.list({
      prefix: ["integrationConnectionByAccountId"],
    });
    for (const { key, value: integrationConnectionByAccountId } of items) {
      integrationConnectionByAccountId.accountId =
        $accountMap[integrationConnectionByAccountId.accountId];
      integrationConnectionByAccountId.hotelId =
        $hotelMap[integrationConnectionByAccountId.hotelId];
      integrationConnectionByAccountId.integrationId =
        $integrationsMap[integrationConnectionByAccountId.integrationId];

      if (
        integrationConnectionByAccountId.hotelId &&
        integrationConnectionByAccountId.integrationId
      )
        await db.set(
          [
            "integrationConnectionByAccountId",
            integrationConnectionByAccountId.accountId,
            integrationConnectionByAccountId.hotelId,
            integrationConnectionByAccountId.integrationId,
          ],
          integrationConnectionByAccountId,
        );
      await db.delete(key);
    }

    //'licenses'
    const { items: licenses } = await db.list({
      prefix: ["licenses"],
    });
    for (const { key, value: license } of licenses) {
      license.hotelId = $hotelMap[license.hotelId];
      license.integrationId = $integrationsMap[license.integrationId];
      license.accountId = $accountMap[license.accountId];

      await db.set(key, license);

      if (!license.integrationId || !license.hotelId) {
        await db.delete(key);
      }
    }

    const { items: licensesByIntegrationIdItems } = await db.list({
      prefix: ["licensesByIntegrationId"],
    });
    for (const {
      key,
      value: licensesByIntegrationId,
    } of licensesByIntegrationIdItems) {
      const [, integrationId] = key;

      if ($integrationsMap[integrationId]) {
        await db.set(
          ["licensesByIntegrationId", $integrationsMap[integrationId]],
          licensesByIntegrationId,
        );
      }

      await db.delete(key);
    }

    const { items: accountsByRefreshToken } = await db.list({
      prefix: ["accountsByRefreshToken"],
    });
    for (const { key } of accountsByRefreshToken) {
      await db.delete(key);
    }

    const { items: accountsByToken } = await db.list({
      prefix: ["accountsByToken"],
    });
    for (const { key } of accountsByToken) {
      await db.delete(key);
    }

    const { items: github } = await db.list({
      prefix: ["github"],
    });
    for (const { key } of github) {
      await db.delete(key);
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;
