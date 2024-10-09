import { ConfigTypes } from "shared/types";

export const getConfig = (): ConfigTypes => {
  // @ts-ignore
  const config = window?.__config__;

  const { hostname } = window.location;

  // @ts-ignore
  return Object.keys(config || {}).length
    ? config
    : {
        version: "latest",
        name: "development",
        description: "development",
        auth: {
          pingCheck: true,
          url: `http://${hostname}:2024`,
          // url: "https://auth.openhotel.club",
        },
      };
};
