import { getGameRequest } from "./game.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const gameRequestList: RequestType[] = getPathRequestList({
  requestList: [getGameRequest],
  pathname: "/game",
});
