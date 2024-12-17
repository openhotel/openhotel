import { UserMutable } from "./user.types.ts";
import { RequestMethod } from "@oh/utils";

type FuncProps = {
  data?: Record<string, string>;
  user?: UserMutable;
};

type Response = {
  status: number;
  data?: any;
};

export type ProxyRequestType = {
  pathname: string;
  method: RequestMethod;
  func: (data: FuncProps, url: URL) => Promise<Response> | Response;
};
