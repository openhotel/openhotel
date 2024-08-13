export const db = () => {
  let kv;

  const load = async () => {
    kv = await Deno.openKv(`./server-database`);
  };

  const get = async (...args) => kv.get(...args);
  const set = async (...args) => kv.set(...args);
  const list = (...args) => kv.list(...args);
  const getMany = async (...args) => kv.getMany(...args);
  const $delete = async (...args) => kv.delete(...args);
  const isEmpty = async (...args): Promise<boolean> => {
    const iterator = kv.list(...args);
    const { done } = await iterator.next();
    return done;
  };

  return {
    load,

    get,
    set,
    list,
    getMany,
    delete: $delete,
    isEmpty,
  };
};
