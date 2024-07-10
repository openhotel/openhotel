import { RequestType } from "shared/types/request.types.ts";

import { helloRequest } from "./hello.request.ts";
import { accountRequestList } from "./account/main.ts";
import { hotelRequestList } from "./hotel/main.ts";

export const requestList: RequestType[] = [
  helloRequest,
  ...accountRequestList,
  ...hotelRequestList,
];
