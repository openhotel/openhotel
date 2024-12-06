import { RequestMethod } from "../enums/main.ts";

export type RequestType<Data = undefined> = {
  pathname: string;
  method: RequestMethod;
  func: (
    request: Request,
    url: URL,
    data?: Data,
  ) => Response | Promise<Response>;
};
