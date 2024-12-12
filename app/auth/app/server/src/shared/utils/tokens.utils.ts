import { System } from "modules/system/main.ts";

export const hasAppTokenAccess = async (request: Request): Promise<boolean> => {
  const appToken = request.headers.get("app-token");
  return appToken && (await System.tokens.verify(appToken));
};
