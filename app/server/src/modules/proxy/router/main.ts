import { getRequestRequest } from "./request.route.ts";
import { getApiRequest } from "./api.route.ts";
import { authRoutesList } from "./auth/main.ts";

export const routesList = [getRequestRequest, getApiRequest, ...authRoutesList];
