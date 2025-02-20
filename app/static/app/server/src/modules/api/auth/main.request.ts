import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";

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
