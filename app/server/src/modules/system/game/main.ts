import { rooms } from "./rooms.ts";
import { users } from "./users.ts";
import { furniture } from "./furniture.ts";
import { teleports } from "./teleports.ts";

export const game = () => {
  const $furniture = furniture();
  const $rooms = rooms();
  const $users = users();
  const $teleports = teleports();

  const load = async () => {
    await $furniture.load();
    await $users.load();
  };

  return {
    load,

    furniture: $furniture,
    rooms: $rooms,
    users: $users,
    teleports: $teleports,
  };
};
