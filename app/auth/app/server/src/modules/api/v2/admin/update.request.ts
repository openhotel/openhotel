import { RequestType } from "shared/types/request.types.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";
import { isAccountAdminValid } from "shared/utils/account.utils.ts";
import { load as loadUpdater } from "modules/updater/main.ts";
import { System } from "modules/system/main.ts";

export const updateGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/update",
  func: async (request, url) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    const canUpdate = await loadUpdater(System.getEnvs());

    if (!canUpdate)
      return Response.json(
        { status: 208 },
        {
          status: 208,
        },
      );

    setTimeout(() => {
      Deno.exit();
    }, 100);

    return Response.json(
      { status: 200 },
      {
        status: 200,
      },
    );
  },
};
