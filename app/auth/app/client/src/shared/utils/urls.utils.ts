import { DEV_MAIN_SERVER_URL, MAIN_SERVER_URL } from "shared/consts";

export const getMainHotelUrl = () =>
  //@ts-ignore
  import.meta.env.DEV ? DEV_MAIN_SERVER_URL : MAIN_SERVER_URL;

export const redirectToFallbackRedirectUrl = () =>
  window.location.replace(
    localStorage.getItem("fallbackRedirectUrl") || getMainHotelUrl(),
  );
