import { rooms } from "./rooms.ts";
import { users } from "./users.ts";

export const game = () => {
  const $users = users();

  const load = () => {
    $users.load();
  };

  return {
    load,

    rooms: rooms(),
    users: $users,
  };
};
