// import { System } from "modules/system/main.ts";
// import * as bcrypt from "@da/bcrypt";

// export const getAccountFromRequest = async ({ headers }: Request) => {
//   const sessionId = headers.get("sessionId");
//
//   const accountBySession = await System.db.get([
//     "accountsBySession",
//     sessionId,
//   ]);
//
//   if (!accountBySession) return null;
//
//   return await System.db.get(["accounts", accountBySession]);
// };
//
// export const isAccountAuthValid = async ({
//   headers,
// }: Request): Promise<number> => {
//   const sessionId = headers.get("sessionId");
//   const token = headers.get("token");
//
//   if (!sessionId || !token) return 403;
//
//   const ticketBySession = await System.db.get(["ticketBySession", sessionId]);
//
//   //cannot use a session generated with a ticket
//   if (ticketBySession) return 410;
//
//   const account = await getAccountFromRequest({ headers } as Request);
//   if (!account) return 403;
//
//   //verify token
//   const result = bcrypt.compareSync(token, account.tokenHash);
//
//   if (!result) return 403;
//   return 200;
// };
//
// export const isAccountAdminValid = async (
//   request: Request,
// ): Promise<number> => {
//   const authStatus = await isAccountAuthValid(request);
//   if (authStatus !== 200) return authStatus;
//
//   const account = await getAccountFromRequest(request);
//   return Boolean(account.isAdmin) ? 200 : 403;
// };
//
// export const getAccountList = async () =>
//   (await System.db.list({ prefix: ["accounts"] })).map(({ value }) => value);

// export const getAdminList = async () =>
//   (await getAccountList()).filter((account) => account.isAdmin);
//
// export const getServerSessionList = async () =>
//   (await System.db.list({ prefix: ["serverSessionByAccount"] })).filter(
//     ({ value: { claimed } }) => claimed,
//   );
//
// export const getRedirectUrl = ({
//   redirectUrl,
//   ticketId,
//   sessionId,
//   token,
//   accountId,
// }) =>
//   `${redirectUrl}?ticketId=${ticketId}&sessionId=${sessionId}&token=${token}&accountId=${accountId}`;

/////////////////

// export const getAccountFromRequest = async ({ headers }: Request) => {
//   let accountId = headers.get("account-id");
//   const sessionId = headers.get("session-id");
//
//   if (!accountId && sessionId) {
//     const session = await System.db.get(["sessions", sessionId]);
//     accountId = session.accountId;
//   }
//
//   return await System.db.get(["accounts", accountId]);
// };
