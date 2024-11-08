import { System } from "system";

export const getAuthPathname = (pathname: string) =>
  `${System.config.get().auth.api}${pathname}`;

export const getPingUrl = () => getAuthPathname("/account/ping");
