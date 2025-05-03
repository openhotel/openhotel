import { rooms } from "./rooms/main.ts";
import { users } from "./users.ts";
import { furniture } from "./furniture.ts";
import { teleports } from "./teleports.ts";
import { economy } from "./economy.ts";
import { companies } from "./companies.ts";

export const game = () => {
  const $furniture = furniture();
  const $rooms = rooms();
  const $users = users();
  const $teleports = teleports();
  const $economy = economy();
  const $companies = companies();

  const load = async () => {
    await $furniture.load();
    await $users.load();
    await $rooms.load();
    await $economy.load();
  };

  return {
    load,

    furniture: $furniture,
    rooms: $rooms,
    users: $users,
    teleports: $teleports,
    economy: $economy,
    companies: $companies,
  };
};
