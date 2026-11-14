import { getRequestRequest } from "./request.request.ts";
import { getApiRequest } from "./api.request.ts";
import { getInfoRequest } from "./info.request.ts";
import { getIconRequest } from "./icon.request.ts";
import { getBackgroundRequest } from "./background.request.ts";
import { getChangelogRequest } from "./changelog.request.ts";
import { getPhantomRequest } from "./phantom.request.ts";

export const routesList = [
  getRequestRequest,
  getApiRequest,
  getInfoRequest,
  getChangelogRequest,
  getPhantomRequest,
  //
  getIconRequest,
  getBackgroundRequest,
];
