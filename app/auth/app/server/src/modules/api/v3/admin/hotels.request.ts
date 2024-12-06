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

    const hotels = await System.hotels.getList();

    return Response.json(
      {
        status: 200,
        data: {
          hotels,
        },
      },
      { status: 200 },
    );
  },
};

export const hotelsDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
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

    const hotelId = url.searchParams.get("hotelId");
    await System.hotels.remove(hotelId);

    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
