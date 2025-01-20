import { Migration, DbMutable } from "@oh/utils";
import { PrivateRoom } from "shared/types/main.ts";

export default {
  id: "2024-12-16--01-03-remove-furniture-uid",
  description: "Add initial rooms",
  up: async (db: DbMutable) => {
    for (const { key, value } of await db.list({ prefix: ["rooms"] })) {
      db.set(key, {
        ...value,
        furniture: value.furniture.map((furni) => ({
          ...furni,
          id: furni.uid,
          furnitureId: furni.id,
        })),
      } as PrivateRoom);
    }
  },
  down: async (db: DbMutable) => {
    for (const { key, value } of await db.list({ prefix: ["rooms"] })) {
      db.set(key, {
        ...value,
        furniture: value.furniture.map((furni) => ({
          ...furni,
          uid: furni.id,
          id: furni.furnitureId,
        })),
      } as PrivateRoom);
    }
  },
} as Migration;
