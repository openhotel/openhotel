import { UserMutable } from "./user.types.ts";
import { RequestMethod } from "@oh/utils";

type FuncProps = {
  data?: Record<string, string>;
  user?: UserMutable;
};

type Response = {
  status: number;
  data?: any;
  headers?: Record<string, string>;
};

export type ProxyRequestType = {
  match?: RegExp;
  pathname?: string;
  method: RequestMethod;
  public?: boolean;
  token?: boolean;
  func: (data: FuncProps, url: URL) => Promise<Response> | Response;
};
