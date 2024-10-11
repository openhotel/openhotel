import { UserMutable } from "shared/types/main.ts";
import { OnetEvent, ProxyEvent } from "shared/enums/event.enum.ts";

type ProxyFuncProps<Data> = {
  data?: Data;
  user?: UserMutable;
};

export type ProxyEventType<Data extends unknown = undefined> = {
  event: ProxyEvent;
  func: (data: ProxyFuncProps<Data>) => Promise<unknown> | unknown;
};

export type OnetEventType<Data extends unknown = undefined> = {
  event: OnetEvent;
  func: (data: Data) => Promise<unknown> | unknown;
};
