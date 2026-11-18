import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  func: (request) => {
    const {
      auth: { enabled },
    } = System.getConfig();

    return Response.json(
      {
        status: 200,
        data: {
          enabled,
        },
      },
      { status: 200 },
    );
  },
};
