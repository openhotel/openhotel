import { System } from "modules/system/main.ts";
import { encrypt, decrypt } from "@oh/utils";

export const getEncryptedEmail = async (email: string): Promise<string> => {
  const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY") ?? "";
  return await encrypt(email, DB_SECRET_KEY);
};

export const getDecryptedEmail = async (
  encryptedEmail: string,
): Promise<string> => {
  const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY") ?? "";
  return await decrypt(encryptedEmail, DB_SECRET_KEY);
};

export const getEmailHash = async (text: string): Promise<string> => {
  const hashedEmail = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return btoa(String.fromCharCode(...new Uint8Array(hashedEmail)));
};

export const getEmailByHash = async (emailHash: string): Promise<string> => {
  const encryptedEmail = (await System.db.get([
    "emailsByHash",
    emailHash,
  ])) as string;
  return await getDecryptedEmail(encryptedEmail);
};

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
