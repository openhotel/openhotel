import { getConfig } from "./config.utils";

export const getAuthPathname = (pathname: string) =>
  `${getConfig().auth.api}${pathname}`;

export const getPingUrl = () => getAuthPathname("/account/ping");
