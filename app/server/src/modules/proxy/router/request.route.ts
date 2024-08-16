import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";
import { protocolToken, ticketMap, userList } from "../proxy.worker.ts";

export const getRequestRequest = {
  method: "GET",
  pathname: "/request",
  fn: async (
    request: Request,
    config: ConfigTypes,
    envs: Envs,
  ): Promise<Response> => {
    //@ts-ignore
    const clientIPAddress: string = request.headers.get("host");
    const { searchParams } = new URL(request.url);
    const clientVersion = searchParams.get("version");

    if (clientVersion !== envs.version)
      return Response.json(
        {
          error: 406,
          message: [
            "Version mismatch",
            `Expected (${envs.version}) != ${clientVersion}`,
          ],
        },
        { status: 406 },
      );

    if (userList.length >= config.limits.players)
      return Response.json(
        {
          error: 406,
          message: ["Hotel is full", "Please try again in a few minutes"],
        },
        { status: 406 },
      );

    const ticketKey = getRandomString(64);

    try {
      const {
        data: { ticketId },
      } = await fetch(`${config.auth.api}/create-ticket`, {
        method: "POST",
        body: JSON.stringify({
          ticketKey,
          redirectUrl: config.auth.redirectUrl,
        }),
      }).then((data) => data.json());

      ticketMap[ticketId] = {
        ticketId,
        ticketKey,
      };
      setTimeout(
        () => {
          delete ticketMap[ticketId];
        },
        1000 * 60 * 60 * 2,
      );

      return Response.json(
        {
          status: 200,
          data: {
            ticketId,
            redirectUrl: `${config.auth.url}#ticketId=${ticketId}`,
            protocolToken,
          },
        },
        { status: 200 },
      );
    } catch (e) {
      return Response.json(
        {
          status: 500,
        },
        { status: 500 },
      );
    }
  },
};