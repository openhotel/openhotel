import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const validateRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/validate",
  func: async (request: Request, url) => {
    if (!(await System.onet.isValidRequest(request)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
