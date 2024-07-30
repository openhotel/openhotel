import { rooms } from "./rooms";
import { users } from "./users";

export const game = () => {
  return {
    rooms: rooms(),
    users: users(),
  };
};
