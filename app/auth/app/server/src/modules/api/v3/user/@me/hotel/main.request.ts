import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    const hotels = await System.hotels.getListByAccountId(account.accountId);

    return getResponse(HttpStatusCode.OK, { data: { hotels } });
  },
};

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const { name, public: $public } = await request.json();

    if (!name) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);
    const response = await System.hotels.add(
      account.accountId,
      name,
      Boolean($public),
    );

    if (!response) return getResponse(HttpStatusCode.NOT_ACCEPTABLE);

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotelId: response.hotelId,
      },
    });
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const { hotelId, name, public: $public } = await request.json();

    if (!hotelId || !name) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);
    if (!hotel || hotel.accountId !== account.accountId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const data = await System.hotels.update(hotelId, name, Boolean($public));

    return getResponse(HttpStatusCode.OK, data);
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotelId = url.searchParams.get("hotelId");
    if (!hotelId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);
    if (!hotel || hotel.accountId !== account.accountId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.hotels.remove(hotelId);

    return getResponse(HttpStatusCode.OK, { data: {} });
  },
};
