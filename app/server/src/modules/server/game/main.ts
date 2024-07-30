import { rooms } from "./rooms.ts";
import { users } from "./users.ts";

export const game = () => {
  return {
    rooms: rooms(),
    users: users(),
  };
};
