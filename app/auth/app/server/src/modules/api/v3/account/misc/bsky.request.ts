import { RequestMethod, RequestType } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { PROTO_DID_REGEX } from "shared/consts/at.consts.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const bskyPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/bsky",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const { did } = await request.json();

    if (!did || !new RegExp(PROTO_DID_REGEX).test(did))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );
    const account = await System.accounts.getFromRequest(request);

    await System.tokens.$fetch(RequestMethod.POST, "/create", Service.AT, {
      username: account.username,
      did: new RegExp(PROTO_DID_REGEX).exec(did)[0],
    });

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
