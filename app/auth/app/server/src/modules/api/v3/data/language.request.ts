import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { LANGUAGE_LIST } from "shared/consts/language.consts.ts";

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
