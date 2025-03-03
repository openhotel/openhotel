import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-16--01-03-remove-furniture-uid",
  description: "Add initial rooms",
  up: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms"] });
    for (const { key, value } of rooms) {
      db.set(key, {
        ...value,
        furniture: value.furniture.map((furni) => ({
          ...furni,
          id: furni.uid,
          furnitureId: furni.id,
        })),
      });
    }
  },
  down: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms"] });
    for (const { key, value } of rooms) {
      db.set(key, {
        ...value,
        furniture: value.furniture.map((furni) => ({
          ...furni,
          uid: furni.id,
          id: furni.furnitureId,
        })),
      });
    }
  },
} as Migration;
