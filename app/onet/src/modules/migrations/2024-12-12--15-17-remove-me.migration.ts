import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-12--15-17-remove-me",
  description: "Initial test migration",
  up: async (db: DbMutable) => {},
  down: async (db: DbMutable) => {},
} as Migration;
