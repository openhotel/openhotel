import {
  RequestType,
  RequestMethod,
  getIpFromRequest,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const { state, scopes, hotelId, integrationId } = await request.json();

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: `Missing inputs!`,
      });

    //Check scopes
    const validScopes: string[] = scopes.filter((scope) =>
      Object.values(Scope).includes(scope),
    );
    if (validScopes.length !== scopes.length)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: `Invalid scopes!`,
      });

    const hotel = await System.hotels.get(hotelId);
    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

    const foundIntegration = hotel.integrations.find(
      (integration) => integrationId === integration.integrationId,
    );
    if (!foundIntegration) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    const redirectUrl = await System.connections.generate({
      hotelId,
      integrationId,

      accountId: account.accountId,
      scopes,
      userAgent,
      ip,
      state,
    });

    if (!redirectUrl) return getResponse(HttpStatusCode.BAD_REQUEST);

    return getResponse(HttpStatusCode.OK, {
      data: {
        redirectUrl,
      },
    });
  },
};

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    const account = await System.accounts.getFromRequest(request);
    const connections = await System.connections.getList(account.accountId);

    if (!connections) return getResponse(HttpStatusCode.NOT_FOUND);

    try {
      if (hotelId && integrationId) {
        const { connections: $connections, ...$connection } = connections.find(
          (connection) => connection.hotelId === hotelId,
        );
        return getResponse(HttpStatusCode.OK, {
          data: {
            connection: {
              ...$connection,
              hotelName: $connection.name,
              ...$connections.find(
                (connection) => connection.integrationId === integrationId,
              ),
            },
          },
        });
      }
    } catch (e) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    return getResponse(HttpStatusCode.OK, { data: { connections } });
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);

    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");
    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    return getResponse(
      (await System.connections.remove(
        account.accountId,
        hotelId,
        integrationId,
      ))
        ? HttpStatusCode.OK
        : HttpStatusCode.BAD_REQUEST,
    );
  },
};
