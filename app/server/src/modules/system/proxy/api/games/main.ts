import { RequestType, getPathRequestList } from "@oh/utils";
import { gamesGetRequest } from "./games.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [gamesGetRequest],
  pathname: "/games",
});
