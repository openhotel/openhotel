import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-12--21-05-private-hotels",
  description: `
  Add public (false) property to all the hotels`,
  up: async (db: DbMutable) => {
    const hotels = await db.list({ prefix: ["hotels"] });
    for await (const hotel of hotels) {
      const hotelKey = hotel.key;
      const hotelValue = hotel.value;

      await db.set(hotelKey, {
        ...hotelValue,
        public: false,
        createdAt: Date.now(),
      });
    }
  },
  down: async (db: DbMutable) => {
    const hotels = await db.list({ prefix: ["hotels"] });
    for await (const hotel of hotels) {
      const hotelKey = hotel.key;
      const hotelValue = hotel.value;

      delete hotelValue.public;
      delete hotelValue.createdAt;
      await db.set(hotelKey, hotelValue);
    }
  },
} as Migration;
