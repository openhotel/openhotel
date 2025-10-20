import { Scope } from "shared/enums/scopes.enums.ts";
import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";

export type Connection = {
  connectionId: string;

  hotelId: string;
  integrationId: string;
  type: DbHotelIntegrationType;

  accountId: string;
  userAgent: string;
  ip: string;
  fingerprint: string;

  scopes: Scope[];

  tokenHash: string;
};
