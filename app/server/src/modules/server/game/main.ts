import { rooms } from "./rooms.ts";
import { users } from "./users.ts";
import { furniture } from "./furniture.ts";

export const game = () => {
  const $users = users();
  const $furniture = furniture();

  const load = async () => {
    await $furniture.load();
    $users.load();
  };

  return {
    load,

    rooms: rooms(),
    users: $users,
    furniture: $furniture,
  };
};
