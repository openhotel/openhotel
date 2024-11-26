import { ServerClient } from "@da/socket";
import { Event } from "shared/enums/event.enums.ts";

export type Server = {
  clientId: string;
  licenseToken: string;
};

export type ServerMutable = {
  load: () => void;

  getSocket: () => ServerClient;
  emit: <Data extends unknown>(event: Event, data: Data) => unknown;

  getTokenId: () => string;
  getToken: () => string;

  getObject: () => Server;
};
