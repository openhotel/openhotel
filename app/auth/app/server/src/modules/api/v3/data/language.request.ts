import { LANGUAGE_LIST } from "shared/consts/language.consts.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const languagesRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/languages",
  kind: RequestKind.PUBLIC,
  func: () => {
    return getResponse(HttpStatusCode.OK, {
      data: {
        languages: LANGUAGE_LIST,
      },
    });
  },
};
