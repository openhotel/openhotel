import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";
import { Scope } from "@shared/enums/scope.enums.ts";

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
