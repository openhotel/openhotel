import { ServerClient } from "@da/socket";
import { Event } from "shared/enums/event.enums.ts";

export type HotelData = {
  name: string;
  owner: string;
  redirectUrl: string;
  type: "web" | "client";
};

export type Server = {
  clientId: string;
  licenseToken: string;

  hotelId: string;
  accountId: string;
  integrationId: string;

  hotelData: HotelData;
};

export type ServerMutable = {
  load: () => void;

  getSocket: () => ServerClient;
  emit: <Data extends unknown>(event: Event, data: Data) => unknown;

  getToken: () => string;

  getHotelData: () => HotelData;
  getHotelId: () => string;
  getIntegrationId: () => string;

  getObject: () => Server;
};
