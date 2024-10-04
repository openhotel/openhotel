import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";

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
