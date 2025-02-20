import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";

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
