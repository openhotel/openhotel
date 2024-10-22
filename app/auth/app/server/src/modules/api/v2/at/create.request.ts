import { RequestMethod, RequestType } from "@oh/utils";
import { System } from "modules/system/main.ts";
import {
  getAccountFromRequest,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";
import { Service } from "shared/enums/services.enums.ts";
import { PROTO_DID_REGEX } from "shared/consts/at.consts.ts";

export const postCreateRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create",
  func: async (request: Request, url) => {
    const status = await isAccountAuthValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    const { did } = await request.json();

    if (!did || !new RegExp(PROTO_DID_REGEX).test(did))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );
    const account = await getAccountFromRequest(request);

    await System.tokens.$fetch(RequestMethod.POST, "/create", Service.AT, {
      username: account.username,
      did,
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
