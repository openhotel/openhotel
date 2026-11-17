import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  func: () => {
    const {
      auth: { enabled },
    } = System.getConfig();

    return getResponse(HttpStatusCode.OK, {
      data: {
        enabled,
      },
    });
  },
};
