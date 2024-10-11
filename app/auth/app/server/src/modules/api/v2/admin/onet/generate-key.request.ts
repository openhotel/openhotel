import { RequestType, RequestMethod } from "@oh/utils";
import { isAccountAdminValid } from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";

export const generateKeyPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/generate-key",
  func: async (request) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    let { api } = await request.json();

    if (!api)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const key = await System.onet.generateKey(api);

    return Response.json(
      { status: 200, data: { key } },
      {
        status: 200,
      },
    );
  },
};
