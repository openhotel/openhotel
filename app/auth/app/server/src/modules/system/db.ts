import { System } from "./main.ts";

export const db = () => {
  let kv;

  const load = async () => {
    kv = await Deno.openKv(`./${System.getConfig().database.filename}`);
  };

  const get = (...args) => kv.get(...args);
  const set = (...args) => kv.set(...args);
  const list = async (...args) => {
    const items = [];
    for await (const entry of kv.list(...args)) items.push(entry);

    return items;
  };
  const getMany = (...args) => kv.getMany(...args);
  const $delete = (...args) => kv.delete(...args);

  return {
    load,

    get,
    set,
    list,
    getMany,
    delete: $delete,
  };
};
