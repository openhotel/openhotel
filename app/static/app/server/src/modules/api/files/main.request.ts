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
  func: async () => {
    const files = await System.files.getList();

    return getResponse(HttpStatusCode.OK, {
      data: {
        files,
      },
    });
  },
};
