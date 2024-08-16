import { rooms } from "./rooms.ts";
import { users } from "./users.ts";
import { furniture } from "./furniture.ts";
import { Language } from "shared/enums/languages.enum.ts";

export const game = () => {
  const $furniture = furniture();
  const $rooms = rooms();
  const $users = users();

  const load = async () => {
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
