import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  name: "Open Hotel",
  description: "Welcome to the Hotel!",
  ports: {
    client: 1994,
    firewall: 2001,
    proxy: 2005,
  },
  limits: {
    players: 100,
    handshakes: 10,
  },
};
