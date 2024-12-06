import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const { hotelId, name, redirectUrl, type } = await request.json();

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);

    if (!hotel || hotel.accountId !== account.accountId)
      return Response.json(
        {
          status: 400,
        },
        {
          status: 400,
        },
      );

    const integrationId = await System.hotels.integrations.add(
      hotelId,
      name,
      redirectUrl,
      type,
    );

    return Response.json(
      {
        status: 200,
        data: {
          integrationId,
        },
      },
      {
        status: 200,
      },
    );
  },
};

//>:4 8 15 16 23 42
export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);

    if (
      !hotelId ||
      !integrationId ||
      !hotel ||
      hotel.accountId !== account.accountId
    )
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const token = await System.hotels.integrations.generateToken(
      hotelId,
      integrationId,
    );

    return Response.json(
      {
        status: 200,
        data: {
          token,
        },
      },
      {
        status: 200,
      },
    );
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);

    if (
      !hotelId ||
      !integrationId ||
      !hotel ||
      hotel.accountId !== account.accountId
    )
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.hotels.integrations.remove(hotelId, integrationId);

    return getResponse(HttpStatusCode.OK);
  },
};
