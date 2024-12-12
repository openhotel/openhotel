const deriveKey = async (key: string): Promise<CryptoKey> => {
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

export const encrypt = async (text: string, key: string): Promise<string> => {
  const encoded = new TextEncoder().encode(text);
  const cryptoKey = await deriveKey(key);

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

export const decrypt = async (
  encryptedText: string,
  key: string,
): Promise<string> => {
  const ivAndEncrypted = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0),
  );

  const iv = ivAndEncrypted.slice(0, 12);
  const encrypted = ivAndEncrypted.slice(12);
  const cryptoKey = await deriveKey(key);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encrypted,
  );

  return new TextDecoder().decode(decrypted);
};
