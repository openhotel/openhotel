import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  name: "Open Hotel",
  description: "Welcome to the Hotel!",
  ports: {
    client: 9980,
    server: 2002,
    range: [10000, 11000],
  },
  limits: {
    players: 100,
    handshake: 10,
  },
};
