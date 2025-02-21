import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enum.ts";

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
