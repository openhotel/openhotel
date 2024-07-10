import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";

export const createRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create",
  func: (request, url) => {
    //TODO
    return new Response("Hello there!", { status: 200 });
  },
};
