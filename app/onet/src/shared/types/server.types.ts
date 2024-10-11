import { ServerClient } from "@da/socket";
import { Event } from "shared/enums/event.enums.ts";

export type Server = {
  clientId: string;
  serverId: string;
  token: string;
  ip: string;
  hostname: string;
};

export type ServerMutable = {
  getId: () => string;
  getHostname: () => string;

  load: () => void;

  getSocket: () => ServerClient;
  emit: <Data extends unknown>(event: Event, data: Data) => unknown;

  getObject: () => Server;
};
