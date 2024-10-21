import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const getValidateRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/validate",
  func: async (request) => {
    if (!(await System.tokens.isValidRequest(request)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    return Response.json(
      { status: 200 },
      {
        status: 200,
      },
    );
  },
};
