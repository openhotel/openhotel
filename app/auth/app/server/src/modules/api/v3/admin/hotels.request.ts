import { RequestType, RequestMethod } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const hotelsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/hotels",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const hostname = url.searchParams.get("hostname");

    const hosts = await System.hosts.getList();

    if (hostname)
      return Response.json(
        {
          status: 200,
          data: {
            host: hosts.find((host) => host.hostname === hostname),
          },
        },
        {
          status: 200,
        },
      );

    return Response.json(
      {
        status: 200,
        data: {
          hosts,
        },
      },
      { status: 200 },
    );
  },
};
