import { RequestType, RequestMethod, getIpFromRequest } from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { state, scopes, redirectUrl } = await request.json();

    if (!redirectUrl)
      return Response.json(
        { status: 400, message: "Missing inputs" },
        {
          status: 400,
        },
      );

    //Check scopes
    const validScopes: string[] = scopes.filter((scope) =>
      Object.values(Scope).includes(scope),
    );
    if (validScopes.length !== scopes.length)
      return Response.json(
        {
          status: 400,
          message: `Invalid scopes!`,
        },
        {
          status: 400,
        },
      );

    let hostname = "";

    try {
      hostname = new URL(redirectUrl).hostname;
    } catch (e) {
      return Response.json(
        { status: 400, message: "Redirect URL is not valid!" },
        {
          status: 400,
        },
      );
    }

    const account = await System.accounts.getFromRequest(request);

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    const {
      connectionId,
      redirectUrl: redirect,
      token,
    } = await System.connections.generate({
      accountId: account.accountId,
      scopes,
      userAgent,
      ip,
      hostname,
      redirectUrl,
      state,
    });

    return Response.json(
      {
        status: 200,
        data: {
          connectionId,
          token,
          redirectUrl: redirect,
        },
      },
      { status: 200 },
    );
  },
};

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
    const hosts = await System.hosts.getListByAccountId(account.accountId);

    const hostname = url.searchParams.get("hostname");
    if (hostname) {
      return Response.json(
        {
          status: 200,
          data: { host: hosts.find((host) => host.hostname === hostname) },
        },
        {
          status: 200,
        },
      );
    }

    return Response.json(
      {
        status: 200,
        data: { hosts },
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

    const account = await System.accounts.getFromRequest(request);

    const hostname = url.searchParams.get("hostname");
    if (!hostname)
      return Response.json(
        {
          status: 400,
        },
        {
          status: 400,
        },
      );

    if (!(await System.connections.remove(account.accountId, hostname)))
      return Response.json(
        {
          status: 400,
        },
        {
          status: 400,
        },
      );

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
