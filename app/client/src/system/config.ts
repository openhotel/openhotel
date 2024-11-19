import { ConfigTypes } from "shared/types";

export const config = () => {
  // @ts-ignore
  const config = window?.__config__;

  const { hostname } = window.location;

  const get = (): ConfigTypes =>
    Object.keys(config || {}).length
      ? config
      : {
          version: "development",
          name: "development",
          description: "development",
          auth: {
            enabled: false,
            api: `http://${hostname}:2024/api/v2`,
            // url: "https://auth.openhotel.club",
          },
          onet: {
            enabled: false,
          },
        };

  return {
    get,
  };
};
