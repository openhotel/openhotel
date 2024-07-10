import { db } from "./db.ts";
import { api } from "./api.ts";

export const System = (() => {
  const $db = db();
  const $api = api();

  const load = async () => {
    await $db.load();
    await $api.load();
  };

  return {
    load,

    db: $db,
    api: $api,
  };
})();
