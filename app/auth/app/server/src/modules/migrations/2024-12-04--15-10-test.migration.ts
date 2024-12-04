import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-04--15-10-test",
  description: "Initial test migration",
  up: async (db: DbMutable) => {
    await db.set(["test"], { foo: "faa" });
  },
  down: async (db: DbMutable) => {},
} as Migration;
