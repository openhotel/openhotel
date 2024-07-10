export const db = () => {
  let kv;

  const load = async () => {
    kv = await Deno.openKv("./database");
    const prefs = {
      username: "ada",
      theme: "dark",
      language: "en-US",
    };

    const result = await set(["preferences", "ada"], prefs);
  };

  const set = <Value>(keys: string[], value: Value) => kv.set(keys, value);
  const get = (keys: string[]) => kv.get(keys);
  const list = (prefix: string[]) => kv.list({ prefix });

  return {
    load,

    set,
    get,
    list,
  };
};
