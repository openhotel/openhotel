import { Migration, DbMutable } from "@oh/utils";
import { ulid } from "@std/ulid";

export default {
  id: "2025-04-10--11-37-remove-furniture",
  description: "Remove furniture from private rooms",
  up: async (db: DbMutable) => {
    const usersIdMap = {
      //old pagoru
      "edd8081d-d160-4bf4-b89b-133d046c87ff": "01J2H3CDB0C14XBWZKH8Z1QYW3",
      //old alqubo
      "873e23bd-c018-41d3-b8a5-0e74aaf8140b": "01J5DRNAN0PQF218376XVQPYRR",
    };

    const { items: rooms } = await db.list({ prefix: ["rooms", "private"] });
    for (const { key, value } of rooms) {
      const id = ulid();
      db.set(["rooms", "private", id], {
        ...value,
        id,
        ownerId: usersIdMap[value.ownerId] ?? value.ownerId,
        furniture: [],
      });
      db.delete(key);
    }

    const { items: users } = await db.list({ prefix: ["users"] });
    for (const { key } of users) {
      if (key[1].includes("-")) {
        db.delete(key);
      }
    }
  },
  down: async () => {},
} as Migration;
