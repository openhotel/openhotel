import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  func: async (request: Request, url) => {
    const api = await System.onet.getApiUrl();

    return Response.json(
      {
        status: 200,
        data: {
          api,
        },
      },
      {
        status: 200,
      },
    );
  },
};
