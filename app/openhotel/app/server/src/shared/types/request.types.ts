import { RequestMethod } from "@oh/utils";

export type Request = {
  method?: RequestMethod;
  pathname: string;
  body?: unknown;
};
