import { RequestMethod } from "@shared/enums/request.enums.ts";

export type Request = {
  method?: RequestMethod;
  pathname: string;
  body?: unknown;
};
