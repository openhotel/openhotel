import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";

export const helloRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/hello",
  func: (request, url) => {
    return new Response("Hello there!", { status: 200 });
  },
};
