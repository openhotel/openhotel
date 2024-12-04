import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-04--15-14-test",
  description: "Initial test migration",
  up: async (db: DbMutable) => {
    console.log(await db.get(["test"]));
    await db.delete(["test"]);
  },
  down: async (db: DbMutable) => {
    await db.set(["test"], { foo: "faa" });
  },
} as Migration;
