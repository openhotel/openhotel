import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    const { files, nextCursor } = await System.files.getList({
      cursor: cursor ?? "",
      limit: Number(limit) ?? 5,
    });

    return getResponse(HttpStatusCode.OK, {
      data: {
        files,
        nextCursor,
      },
    });
  },
};
