import { ConfigTypes } from "shared/types";

export const getConfig = (): ConfigTypes => {
  // @ts-ignore
  const config = window?.__config__;

  const { hostname } = window.location;

  // @ts-ignore
  return Object.keys(config || {}).length
    ? config
    : {
        version: 1,
        name: "DEVELOPMENT",
        description: "DEVELOPMENT",
        proxy: {
          port: 2005,
          url: `http://${hostname}:2005`,
        },
        firewall: {
          port: 2001,
          url: `http://${hostname}:2001`,
        },
        auth: {
          url: `http://${hostname}:2024`,
        },
      };
};
