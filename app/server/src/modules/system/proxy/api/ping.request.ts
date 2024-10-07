import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod } from "@oh/utils";

export const pingRequest: ProxyRequestType = {
  pathname: "/ping",
  method: RequestMethod.GET,
  func: ({ data }) => {
    return {
      status: 200,
      data: {
        pong: performance.now(),
      },
    };
  },
};
