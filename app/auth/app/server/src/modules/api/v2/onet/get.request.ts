import { RequestMethod, RequestType } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { Service } from "shared/enums/services.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  func: async (request: Request, url) => {
    const api = await System.tokens.getApiUrl(Service.ONET);

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
