import { getRandomString, getURL, RequestMethod } from "@oh/utils";
import { log } from "shared/utils/log.utils.ts";
import { Proxy } from "modules/proxy/main.ts";

export const getRequestRequest = {
  method: "GET",
  pathname: "/request",
  fn: async (request: Request): Promise<Response> => {
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

    const ticketKey = getRandomString(64);

    try {
      const data = await Proxy.auth.fetch<any>(
        RequestMethod.POST,
        `/create-ticket`,
        {
          ticketKey,
          redirectUrl: config.auth.redirectUrl,
        },
      );

      if (!data) throw "ERROR: Cannot create auth ticket!";

      const { ticketId } = data;

      Proxy.setTicket(ticketId, ticketKey);
      setTimeout(
        () => {
          Proxy.deleteTicket(ticketId);
        },
        1000 * 60 * 60 * 2,
      );

      return Response.json(
        {
          status: 200,
          data: {
            ticketId,
            redirectUrl: `${config.auth.url}#ticketId=${ticketId}`,
            protocolToken: Proxy.getProtocolToken(),
          },
        },
        { status: 200 },
      );
    } catch (e) {
      log(e);
      return Response.json(
        {
          status: 500,
        },
        { status: 500 },
      );
    }
  },
};
