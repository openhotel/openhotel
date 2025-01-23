import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-23--22-00-remove-invalid-connections",
  description: `remove invalid 'connections' from null hotels`,
  up: async (db: DbMutable) => {
    const connections = await db.list({
      prefix: ["integrationsByAccountId"],
    });
    for await (const connection of connections) {
      const hotel = await db.get(["hotels", connection.value.hotelId]);
      if (!hotel) await db.delete(connection.key);
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;
