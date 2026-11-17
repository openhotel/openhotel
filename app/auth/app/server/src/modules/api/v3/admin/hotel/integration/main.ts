import { mainDeleteRequest } from "./main.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const integrationRequestList: RequestType[] = getPathRequestList({
  requestList: [mainDeleteRequest],
  pathname: "/integration",
});
