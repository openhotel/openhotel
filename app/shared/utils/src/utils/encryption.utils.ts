import * as bcrypt from "@da/bcrypt";

const deriveKeySHA256 = async (key: string): Promise<CryptoKey> => {
  const hashedKey = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key),
  );

  return crypto.subtle.importKey(
    "raw",
    hashedKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

export const encryptSHA256 = async (
  text: string,
  key: string,
): Promise<string> => {
  const encoded = new TextEncoder().encode(text);
  const cryptoKey = await deriveKeySHA256(key);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoded,
  );

  const ivAndEncrypted = new Uint8Array(iv.length + encrypted.byteLength);
  ivAndEncrypted.set(iv);
  ivAndEncrypted.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...ivAndEncrypted));
};

export const decryptSHA256 = async (
  encryptedText: string,
  key: string,
): Promise<string> => {
  const ivAndEncrypted = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0),
  );

  const iv = ivAndEncrypted.slice(0, 12);
  const encrypted = ivAndEncrypted.slice(12);
  const cryptoKey = await deriveKeySHA256(key);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encrypted,
  );

  return new TextDecoder().decode(decrypted);
};

export const getSHA256HashText = async (text: string): Promise<string> => {
  const hashesBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return btoa(String.fromCharCode(...new Uint8Array(hashesBuffer)));
};

export const getSHA512HashText = async (text: string): Promise<string> => {
  const hashesBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(text),
  );
  return btoa(String.fromCharCode(...new Uint8Array(hashesBuffer)));
};

export const getSHA512HashTextHex = async (text: string): Promise<string> => {
  // Convert the input string to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate the SHA-512 hash
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const encryptToken = (token: string): string =>
  bcrypt.hashSync(token, bcrypt.genSaltSync(8));

export const compareToken = (token: string, tokenHash: string): boolean =>
  bcrypt.compareSync(token, tokenHash);
