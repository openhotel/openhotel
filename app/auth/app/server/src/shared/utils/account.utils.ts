import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const getAccountFromRequest = async ({ headers }: Request) => {
  const sessionId = headers.get("sessionId");

  const { value: accountBySession } = await System.db.get([
    "accountsBySession",
    sessionId,
  ]);

  if (!accountBySession) return null;

  const { value: account } = await System.db.get([
    "accounts",
    accountBySession,
  ]);

  return account;
};

export const isAccountAuthValid = async ({
  headers,
}: Request): Promise<number> => {
  const sessionId = headers.get("sessionId");
  const token = headers.get("token");

  if (!sessionId || !token) return 403;

  const { value: ticketBySession } = await System.db.get([
    "ticketBySession",
    sessionId,
  ]);

  //cannot use a session generated with a ticket
  if (ticketBySession) return 410;

  const account = await getAccountFromRequest({ headers } as Request);
  if (!account) return 403;

  //verify token
  const result = bcrypt.compareSync(token, account.tokenHash);

  if (!result) return 403;
  return 200;
};

export const isAccountAdminValid = async (
  request: Request,
): Promise<number> => {
  const authStatus = await isAccountAuthValid(request);
  if (authStatus !== 200) return authStatus;

  const account = await getAccountFromRequest(request);
  return Boolean(account.isAdmin) ? 200 : 403;
};

export const getAccountList = async () =>
  (await System.db.list({ prefix: ["accounts"] })).map(({ value }) => value);
export const getAdminList = async () =>
  (await getAccountList()).filter((account) => account.isAdmin);
