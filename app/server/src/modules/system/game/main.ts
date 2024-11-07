import { rooms } from "./rooms.ts";
import { users } from "./users.ts";
import { furniture } from "./furniture.ts";
import { configure } from "@zip-js";

export const game = () => {
  const $furniture = furniture();
  const $rooms = rooms();
  const $users = users();

  const load = async () => {
    //prevent use web workers
    configure({ useWebWorkers: false });

    await $furniture.load();
    await $rooms.load();
    $users.load();
  };

  return {
    load,

    furniture: $furniture,
    rooms: $rooms,
    users: $users,
  };
};
