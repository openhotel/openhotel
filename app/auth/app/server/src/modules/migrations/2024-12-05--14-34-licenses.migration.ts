import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-05--14-34-licenses",
  description: `
    This migrations removes all the current licenses, hosts, connections...
    to make room to the new hotels system
  `,
  up: async (db: DbMutable) => {
    const removeAllItems = async (id: string) => {
      for (const { key } of await db.list({ prefix: [id] }))
        await db.delete(key);
    };
    //licenses
    await removeAllItems("licenses");
    //licensesByAccountId
    await removeAllItems("licensesByAccountId");

    //hosts
    await removeAllItems("hosts");
    //hostsByHostname
    await removeAllItems("hostsByHostname");
    //hostsByAccountId
    await removeAllItems("hostsByAccountId");

    //connections
    await removeAllItems("connections");
    //connectionsByAccountId
    await removeAllItems("connectionsByAccountId");
  },
  down: async (db: DbMutable) => {},
} as Migration;
