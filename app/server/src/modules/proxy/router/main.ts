import { getRequestRequest } from "./request.request.ts";
import { getApiRequest } from "./api.request.ts";
import { getVersionRequest } from "./version.request.ts";
import { getConfigRequest } from "./config.request.ts";

export const routesList = [
  getRequestRequest,
  getApiRequest,
  getVersionRequest,
  getConfigRequest,
];
