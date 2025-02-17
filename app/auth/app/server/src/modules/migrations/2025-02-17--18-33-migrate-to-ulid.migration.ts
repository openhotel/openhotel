import { Migration, DbMutable } from "@oh/utils";
import { ulid } from "jsr:@std/ulid@1";

export default {
  id: "2025-02-17--18-33-migrate-to-ulid",
  description: `Migration to ULID instead of UUID`,
  up: async (db: DbMutable) => {
    const $accountMap: Record<string, string> = {};
    const $hotelMap: Record<string, string> = {};
    const $integrationsMap: Record<string, string> = {};

    for (const { key } of await db.list({
      prefix: ["accountsByUsername"],
    })) {
      await db.delete(key);
    }
    for (const { key, value: account } of await db.list({
      prefix: ["accounts"],
    })) {
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

    for (const { key, value: accountId } of await db.list({
      prefix: ["accountsByEmail"],
    })) {
      await db.set(key, $accountMap[accountId]);
    }

    for (const { key, value: hotel } of await db.list({
      prefix: ["hotels"],
    })) {
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

    for (const {
      key,
      value: integrationConnectionByAccountId,
    } of await db.list({
      prefix: ["integrationConnectionByAccountId"],
    })) {
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
    for (const { key, value: license } of await db.list({
      prefix: ["licenses"],
    })) {
      license.hotelId = $hotelMap[license.hotelId];
      license.integrationId = $integrationsMap[license.integrationId];
      license.accountId = $accountMap[license.accountId];

      await db.set(key, license);

      if (!license.integrationId || !license.hotelId) {
        await db.delete(key);
      }
    }

    for (const { key, value: licensesByIntegrationId } of await db.list({
      prefix: ["licensesByIntegrationId"],
    })) {
      const [, integrationId] = key;

      if ($integrationsMap[integrationId]) {
        await db.set(
          ["licensesByIntegrationId", $integrationsMap[integrationId]],
          licensesByIntegrationId,
        );
      }

      await db.delete(key);
    }

    for (const { key } of await db.list({
      prefix: ["accountsByRefreshToken"],
    })) {
      await db.delete(key);
    }
    for (const { key } of await db.list({
      prefix: ["accountsByToken"],
    })) {
      await db.delete(key);
    }
    for (const { key } of await db.list({
      prefix: ["github"],
    })) {
      await db.delete(key);
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;
