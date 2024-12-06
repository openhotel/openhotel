import { RequestType, RequestMethod } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

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

    const account = await System.accounts.getFromRequest(request);
    const hotels = await System.hotels.getListByAccountId(account.accountId);

    return Response.json(
      {
        status: 200,
        data: {
          hotels,
        },
      },
      {
        status: 200,
      },
    );
  },
};

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

    const { name } = await request.json();

    if (!name)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const account = await System.accounts.getFromRequest(request);
    const response = await System.hotels.add(account.accountId, name);

    if (!response)
      return Response.json(
        {
          status: 406,
        },
        { status: 406 },
      );

    return Response.json(
      {
        status: 200,
        data: {
          hotelId: response.hotelId,
        },
      },
      {
        status: 200,
      },
    );
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
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

    const { hotelId, name } = await request.json();

    if (!hotelId || !name)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);
    if (!hotel || hotel.accountId !== account.accountId)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const data = await System.hotels.update(hotelId, name);

    return Response.json(
      {
        status: 200,
        data,
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
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const hotelId = url.searchParams.get("hotelId");
    if (!hotelId)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const account = await System.accounts.getFromRequest(request);
    const hotel = await System.hotels.get(hotelId);
    if (!hotel || hotel.accountId !== account.accountId)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    await System.hotels.remove(hotelId);

    return Response.json(
      {
        status: 200,
        data: {},
      },
      {
        status: 200,
      },
    );
  },
};
