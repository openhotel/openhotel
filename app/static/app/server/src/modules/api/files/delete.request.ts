import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const deleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request) => {
    const { id } = await request.json();
    if (!id) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    const file = await System.files.get(id);
    if (!file) {
      return getResponse(HttpStatusCode.NOT_FOUND);
    }

    await System.files.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
