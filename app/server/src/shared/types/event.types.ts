import { UserMutable } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

type FuncProps<Data> = {
  data?: Data;
  user?: UserMutable;
};

export type ProxyEventType<Data = {}> = {
  event: ProxyEvent;
  func: (data: FuncProps<Data>) => Promise<any> | any;
};
