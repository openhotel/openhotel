import { ServerClient } from "@da/socket";
import { Event } from "shared/enums/event.enums.ts";
import { Scope } from "shared/enums/scope.enums.ts";

export type HotelData = {
  name: string;
  owner: string;
  redirectUrl: string;
  type: "web" | "client";
};

export type Hotel = {
  clientId: string;
  licenseToken: string;

  hotelId: string;
  accountId: string;
  integrationId: string;

  hotelData: HotelData;
};

export type HotelMutable = {
  load: () => void;

  getSocket: () => ServerClient;
  emit: <Data extends unknown>(event: Event, data: Data) => unknown;

  getToken: () => string;

  getHotelData: () => HotelData;
  getHotelId: () => string;
  getIntegrationId: () => string;

  verify: (apiToken: string) => boolean;

  hasAccountScopes: (accountId: string, scopes: Scope[]) => Promise<boolean>;

  getObject: () => Hotel;
};
