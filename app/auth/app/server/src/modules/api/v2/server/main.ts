import { RequestType, getPathRequestList } from "@oh/utils";

import { claimSessionRequest } from "./claim-session.request.ts";
import { createTicketRequest } from "./create-ticket.request.ts";
import { registerRequest } from "./register.request.ts";
import { validateRequest } from "./validate.request.ts";

export const serverRequestList: RequestType[] = getPathRequestList({
  requestList: [
    claimSessionRequest,
    createTicketRequest,
    registerRequest,
    validateRequest,
  ],
  pathname: "/server",
});
