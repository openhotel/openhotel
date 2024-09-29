import { getConfig } from "./config.utils";

export const getAuthPathname = (pathname: string) =>
  `${getConfig().auth.url}${pathname}`;

export const getPingUrl = () => getAuthPathname("/api/v2/account/ping");
