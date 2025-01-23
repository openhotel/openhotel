import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-23--15-15-remove-integrations-by-hotels-by-account-id",
  description: `remove 'integrationsByHotelsByAccountId' and move it to 'integrationsByAccountId'`,
  up: async (db: DbMutable) => {
    const integrations = await db.list({
      prefix: ["integrationsByHotelsByAccountId"],
    });
    for await (const integration of integrations) {
      integration.key[0] = "integrationsByAccountId";
      await db.set(integration.key, integration.value);
      await db.set(
        [
          "integrationsByHotelsByAccountId",
          integration.value.hotelId,
          integration.value.integrationId,
          integration.value.accountId,
        ],
        integration.value.accountId,
      );
    }
  },
  down: async (db: DbMutable) => {
    const integrations = await db.list({
      prefix: ["integrationsByAccountId"],
    });
    for await (const integration of integrations) {
      integration.key[0] = "integrationsByHotelsByAccountId";
      await db.set(integration.key, integration.value);
      await db.delete([
        "integrationsByHotelsByAccountId",
        integration.value.hotelId,
        integration.value.integrationId,
        integration.value.accountId,
      ]);
    }
  },
} as Migration;
