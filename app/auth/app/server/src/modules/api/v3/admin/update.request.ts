import { RequestType, RequestMethod, update } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const updateGetRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/update",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
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
