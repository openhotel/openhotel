import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const gamesGetRequest: ProxyRequestType = {
  match: /^\/games\/([^/]+)$/,
  method: RequestMethod.GET,
  func: async ({}, url) => {
    const gameId = url.pathname.split("/").reverse()[0];

    const manifest = System.games.getManifest(gameId);
    if (!manifest) {
      return {
        status: 404,
        data: {
          error: "Game not found",
        },
      };
    }

    return {
      status: 200,
      data: {
        manifest,
      },
    };
  },
};
