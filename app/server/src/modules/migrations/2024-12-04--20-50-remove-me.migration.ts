import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-04--20-50-remove-me",
  description: "Initial test migration",
  up: async (db: DbMutable) => {},
  down: async (db: DbMutable) => {},
} as Migration;
