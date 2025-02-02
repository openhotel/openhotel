import { System } from "modules/system/main.ts";
import { encrypt, decrypt } from "@oh/utils";

export const getEncryptedEmail = async (email: string): Promise<string> => {
  return await encrypt(email.toLowerCase(), System.getDbSecretKey());
};

export const getDecryptedEmail = async (
  encryptedEmail: string,
): Promise<string> => {
  return await decrypt(encryptedEmail, System.getDbSecretKey());
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
