import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "bcrypt";
import { TICKET_EXPIRE_TIME } from "shared/consts/tickets.consts.ts";

export const createTicketRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create-ticket",
  func: async (request: Request, url) => {
    if (!(await System.servers.isRequestValid(request)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    let { ticketKey, redirectUrl } = await request.json();

    if (!ticketKey || !redirectUrl)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const ticketId = crypto.randomUUID();
    await System.db.set(
      ["tickets", ticketId],
      {
        ticketId,
        ticketKeyHash: bcrypt.hashSync(ticketKey, bcrypt.genSaltSync(8)),
        redirectUrl,
        isUsed: false,
      },
      {
        expireIn: TICKET_EXPIRE_TIME,
      },
    );

    return Response.json({
      status: 200,
      data: {
        ticketId,
      },
    });
  },
};
