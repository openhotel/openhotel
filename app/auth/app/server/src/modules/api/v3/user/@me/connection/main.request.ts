import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
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

    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    const redirectUrl = await account.connections.active.create({
      request,

      hotelId,
      integrationId,

      scopes,
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
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    const account = await System.accounts.getAccount({ request });

    const $connections = await account.connections.getConnections();

    if (!$connections) return getResponse(HttpStatusCode.NOT_FOUND);

    const $hotels = [
      ...new Set($connections.map((connection) => connection.hotelId)),
    ];

    const activeConnection = await account.connections.active.get();

    const connections = (
      await Promise.all(
        $hotels.map(async (hotelId: string) => {
          const hotel = await System.hotels.getHotel({ hotelId });
          const hotelData = hotel.getObject();

          if (hotelData.blocked) return null;

          return {
            hotelId,
            name: hotelData.name,
            owner: (await hotel.getOwner()).getObject().username,
            verified: false,
            connections: $connections
              .filter((connection) => connection.hotelId === hotelId)
              .map((connection) => {
                const integration = hotel.getIntegration({
                  integrationId: connection.integrationId,
                });
                const integrationData = integration.getObject();

                return {
                  active:
                    activeConnection?.hotelId === hotelId &&
                    activeConnection?.integrationId ===
                      connection.integrationId,
                  integrationId: connection.integrationId,
                  scopes: connection.scopes,
                  name: integrationData.name,
                  redirectUrl: integrationData.redirectUrl,
                  type: integrationData.type,
                };
              }),
          };
        }),
      )
    ).filter(Boolean);

    //

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
      return getResponse(HttpStatusCode.NOT_FOUND);
    }

    return getResponse(HttpStatusCode.OK, { data: { connections } });
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const account = await System.accounts.getAccount({ request });

    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");
    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await account.connections.remove(hotelId, integrationId);

    return getResponse(HttpStatusCode.OK);
  },
};
