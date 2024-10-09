import { getRequestRequest } from "./request.request.ts";
import { getApiRequest } from "./api.request.ts";
import { authRoutesList } from "./auth/main.ts";
import { getVersionRequest } from "./version.request.ts";

export const routesList = [
  getRequestRequest,
  getApiRequest,
  getVersionRequest,
  ...authRoutesList,
];
