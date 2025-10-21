import { user } from "modules/proxy/core/user.ts";
import { game } from "modules/proxy/core/game.ts";

export const core = () => {
  const $coreUser = user();
  const $coreGame = game();

  return {
    user: $coreUser,
    game: $coreGame,
  };
};
