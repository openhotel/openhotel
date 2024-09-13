import { ProxyRequestType } from "shared/types/api.types.ts";

export const pingRequest: ProxyRequestType = {
  pathname: "/ping",
  func: ({ data }) => {
    return {
      status: 200,
      data: {
        pong: performance.now(),
      },
    };
  },
};
