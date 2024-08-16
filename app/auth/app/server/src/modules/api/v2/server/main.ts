import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";
import { claimSessionRequest } from "./claim-session.request.ts";
import { createTicketRequest } from "./create-ticket.request.ts";

export const serverRequestList: RequestType[] = getPathRequestList({
  requestList: [claimSessionRequest, createTicketRequest],
  pathname: "/server",
});
