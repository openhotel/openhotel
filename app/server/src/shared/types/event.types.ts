import { User } from "shared/types/main.ts";

type FuncProps<Data> = {
  data?: Data;
  user?: User;
};

export type ProxyEventType<Data = {}> = {
  event: string;
  func: (data: FuncProps<Data>) => Promise<any> | any;
};
