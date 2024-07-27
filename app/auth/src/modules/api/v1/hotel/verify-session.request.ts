import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const verifySessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/verify-session",
  func: async (request, url) => {
    const { sessionId, token, username } = await request.json();

    // Check if body is valid
    if (!sessionId || !token || !username)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    // Retrieve session
    const { value: session } = await System.db.get(["session", sessionId]);

    // Check if session exists
    if (!session)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    // Verify session token is valid
    const result = bcrypt.compareSync(token, session.hash);
    if (!result)
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    // Retrieve account from username
    const { value: account } = await System.db.get(["accounts", username]);

    // Verify if session and username are from the same account
    if (!account || account.accountId !== session.accountId)
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    // Delete current session
    await System.db.delete(["session", sessionId]);
    // Check if session is current
    if (account.sessionId !== sessionId)
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    return Response.json(
      {
        status: 200,
        data: {
          accountId: session.accountId,
          username: account.username,
        },
      },
      { status: 200 },
    );
  },
};
