import { Event } from "shared/enums/event.enums.ts";
import { ServerMutable } from "shared/types/server.types.ts";

type FuncProps<Data> = {
  data?: Data;
  server: ServerMutable;
};

export type EventType<Data extends unknown = undefined> = {
  event: Event;
  func: (data: FuncProps<Data>) => Promise<unknown> | unknown;
};
