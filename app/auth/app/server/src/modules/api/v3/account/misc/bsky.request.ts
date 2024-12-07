import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { PROTO_DID_REGEX } from "shared/consts/at.consts.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const bskyPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/bsky",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const { did } = await request.json();

    if (!did || !new RegExp(PROTO_DID_REGEX).test(did))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);

    await System.tokens.$fetch(RequestMethod.POST, "/create", Service.AT, {
      username: account.username,
      did: new RegExp(PROTO_DID_REGEX).exec(did)[0],
    });

    return getResponse(HttpStatusCode.OK);
  },
};
