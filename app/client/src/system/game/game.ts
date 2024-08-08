import { rooms } from "./rooms";
import { users } from "./users";
import { furniture } from "./furniture";
import { human } from "./human";

export const game = () => {
  const $furniture = furniture();
  const $human = human();

  const load = async () => {
    await $furniture.load();
    await $human.load();
  };

  return {
    load,

    rooms: rooms(),
    users: users(),
    furniture: $furniture,
    human: $human,
  };
};
