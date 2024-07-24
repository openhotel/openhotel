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
          // url: "https://auth.openhotel.club",
        },
        captcha: {
          enabled: true,
          id: "hwoFA5ORzPAYkHyCNElRU0F3WXAD0ZN9",
          // url: "http://${hostname}:1960",
          url: "https://captcha.openhotel.club",
        },
      };
};
