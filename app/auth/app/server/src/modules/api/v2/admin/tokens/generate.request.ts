import { RequestType, RequestMethod } from "@oh/utils";
import { isAccountAdminValid } from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";
import { isServiceValid } from "shared/utils/services.utils.ts";

export const postGenerateRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/generate",
  func: async (request) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    let { api, service } = await request.json();

    if (!api || !service || !isServiceValid(service))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const data = await System.tokens.generateKey(service, api);

    return Response.json(
      { status: 200, data },
      {
        status: 200,
      },
    );
  },
};
