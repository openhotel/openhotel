import { UserMutable } from "shared/types/main.ts";

type FuncProps<Data> = {
  data?: Data;
  user?: UserMutable;
};

export type ProxyEventType<Data = {}> = {
  event: string;
  func: (data: FuncProps<Data>) => Promise<any> | any;
};
