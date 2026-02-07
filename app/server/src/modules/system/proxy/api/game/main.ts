import { RequestType, getPathRequestList } from "@oh/utils";

import { getGameRequest } from "./game.request.ts";

export const gameRequestList: RequestType[] = getPathRequestList({
  requestList: [getGameRequest],
  pathname: "/game",
});
