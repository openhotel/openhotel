import { getRequestRequest } from "./request.request.ts";
import { getApiRequest } from "./api.request.ts";
import { getInfoRequest } from "modules/proxy/router/info.request.ts";

export const routesList = [getRequestRequest, getApiRequest, getInfoRequest];
