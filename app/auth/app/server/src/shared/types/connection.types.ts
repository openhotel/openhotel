import { Scope } from "shared/enums/scopes.enums.ts";

export type Connection = {
  connectionId: string;

  hotelId: string;
  integrationId: string;

  accountId: string;
  userAgent: string;
  ip: string;

  scopes: Scope[];

  tokenHash: string;
};
