import { getConfig } from "./config.utils";

export const getAuthPathname = (pathname: string) =>
  `${getConfig().auth.url}${pathname}`;

export const getLoginUrl = () => getAuthPathname("/v1/account/login");
export const getRegisterUrl = () => getAuthPathname("/v1/account/register");
export const getRefreshSessionUrl = () =>
  getAuthPathname("/v1/account/refresh-session");

export const getPingUrl = () => getAuthPathname("/v1/account/ping");
