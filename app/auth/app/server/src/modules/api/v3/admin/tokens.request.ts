import { RequestType, RequestMethod } from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";

export const tokensGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const tokens = (await System.tokens.getList()).map(({ id, label }) => ({
      id,
      label,
    }));

    return Response.json(
      {
        status: 200,
        data: { tokens },
      },
      {
        status: 200,
      },
    );
  },
};

export const tokensPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const { label } = await request.json();

    if (!label)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    const { id, token } = await System.tokens.generate(label);

    return Response.json(
      {
        status: 200,
        data: {
          id,
          label,
          token,
        },
      },
      {
        status: 200,
      },
    );
  },
};

export const tokensDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const id = url.searchParams.get("id");
    if (!id)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    await System.tokens.remove(id);

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
