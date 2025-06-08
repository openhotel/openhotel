export const gamesLoaders: Record<string, () => any> = {
  template: () => import("@openhotel/game-template"),
  local: () =>
    import(
      "/Users/albertoquiles/dev/pp/OpenHotel/game-template/build/client/bundle.js"
    ),
};
