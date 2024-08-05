import { rooms } from "./rooms";
import { users } from "./users";
import { furniture } from "./furniture";

export const game = () => {
  const $furniture = furniture();

  const load = async () => {
    await $furniture.load();
  };

  return {
    load,

    rooms: rooms(),
    users: users(),
    furniture: $furniture,
  };
};
