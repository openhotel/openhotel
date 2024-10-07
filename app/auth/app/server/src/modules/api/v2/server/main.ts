import { RequestType, getPathRequestList } from "@oh/utils";

import { claimSessionRequest } from "./claim-session.request.ts";
import { createTicketRequest } from "./create-ticket.request.ts";

export const serverRequestList: RequestType[] = getPathRequestList({
  requestList: [claimSessionRequest, createTicketRequest],
  pathname: "/server",
});
