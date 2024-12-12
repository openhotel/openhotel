import { getURL } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";
import { Scope } from "shared/enums/scopes.enums.ts";

export const getRequestRequest = {
  method: "GET",
  pathname: "/request",
  fn: async (request: Request): Promise<Response> => {
    if (!(await Proxy.auth.isAuthEnabled()))
      return Response.json(
        {
          error: 400,
        },
        { status: 400 },
      );

    const { version } = Proxy.getEnvs();
    const config = Proxy.getConfig();

    const { searchParams } = getURL(request.url);
    const clientVersion = searchParams.get("version");

    if (clientVersion !== version)
      return Response.json(
        {
          error: 406,
          message: [
            "Version mismatch",
            `Expected (${version}) != ${clientVersion}`,
          ],
        },
        { status: 406 },
      );

    if (Proxy.getUserList().length >= config.limits.players)
      return Response.json(
        {
          error: 406,
          message: ["Hotel is full", "Please try again in a few minutes"],
        },
        { status: 406 },
      );

    const { onet } = Proxy.getConfig();

    const scopes = (
      [
        ...(onet.enabled
          ? [
              Scope.ONET_FRIENDS_READ,
              Scope.ONET_FRIENDS_WRITE,

              Scope.ONET_MESSAGES_READ,
              Scope.ONET_MESSAGES_WRITE,

              Scope.ONET_TELEPORTS_LINK,
            ]
          : []),
      ] as Scope[]
    ).join(",");

    const hotelId = Proxy.auth.getHotelId();
    const integrationId = Proxy.auth.getIntegrationId();

    const composedRedirectUrl = new URL(`${config.auth.api}/connection`);
    composedRedirectUrl.searchParams.append("state", Proxy.getState());

    if (hotelId) composedRedirectUrl.searchParams.append("hotelId", hotelId);
    if (integrationId)
      composedRedirectUrl.searchParams.append("integrationId", integrationId);
    if (scopes) composedRedirectUrl.searchParams.append("scopes", scopes);

    return Response.json(
      {
        status: 200,
        data: {
          redirectUrl: composedRedirectUrl.href,
        },
      },
      { status: 200 },
    );
  },
};
