import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-26--00-10-remove-furniture",
  description: "Add initial rooms",
  up: async (db: DbMutable) => {
    await Deno.remove("./assets/furniture/.data/", { recursive: true });
  },
  down: async (db: DbMutable) => {},
} as Migration;
