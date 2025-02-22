import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async () => {
    const files = await System.files.getList();

    return getResponse(HttpStatusCode.OK, {
      data: {
        files,
      },
    });
  },
};
