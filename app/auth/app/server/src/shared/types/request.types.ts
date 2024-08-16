import { RequestMethod } from "../enums/main.ts";

export type RequestType = {
  method: RequestMethod;
  pathname: string;
  func: (request: Request, url: URL) => Response | Promise<Response>;
};
