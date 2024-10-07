import { RequestType, RequestMethod, update } from "@oh/utils";
import { isAccountAdminValid } from "shared/utils/account.utils.ts";
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

    const { version } = System.getEnvs();

    const canUpdate =
      version !== "DEVELOPMENT" &&
      (await update({
        targetVersion: "latest",
        version,
        repository: "openhotel/auth",
        log: console.log,
        debug: console.debug,
      }));

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
