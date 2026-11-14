import { RedirectType } from "shared/types";

export const getLoginRedirect = ({ type, ...data }: RedirectType) =>
  `/login?redirect=${btoa(JSON.stringify({ type, ...data }))}`;
