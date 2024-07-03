import { ConfigTypes } from "shared/types";

export const getConfig = (): ConfigTypes => {
  // @ts-ignore
  const config = window?.__config__;

  // @ts-ignore
  return Object.keys(config || {}).length
    ? config
    : {
        name: "DEVELOPMENT",
        description: "DEVELOPMENT",
        proxy: {
          port: 2005,
          url: "http://localhost:2005",
        },
        firewall: {
          port: 2001,
          url: "http://localhost:2001",
        },
      };
};
