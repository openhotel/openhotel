import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";

export const deleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/delete",
  func: (request, url) => {
    //TODO
    return new Response("Hello there!", { status: 200 });
  },
};
