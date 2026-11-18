import { DbMutable, Migration } from "@shared/types/db.types.ts";

const NUMBER_TO_STRING = ["furniture", "frame"];
const STRING_TO_NUMBER = { furniture: 0, frame: 1 };

export default {
  id: "2026-11-18--23-04-furniture-type-string",
  description: "Furniture type from number to string",
  up: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms", "private"] });
    for (const { key, value } of rooms) {
      if (!value?.furniture) continue;
      await db.set(key, {
        ...value,
        furniture: value.furniture.map((furniture) => ({
          ...furniture,
          type:
            typeof furniture.type === "number"
              ? NUMBER_TO_STRING[furniture.type]
              : furniture.type,
        })),
      });
    }
  },
  down: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms", "private"] });
    for (const { key, value } of rooms) {
      if (!value?.furniture) continue;
      await db.set(key, {
        ...value,
        furniture: value.furniture.map((furniture) => ({
          ...furniture,
          type:
            typeof furniture.type === "string"
              ? STRING_TO_NUMBER[furniture.type]
              : furniture.type,
        })),
      });
    }
  },
} as Migration;
