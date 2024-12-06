const deriveKey = async (key: string): Promise<CryptoKey> => {
  const hashedKey = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key),
  );

  return await crypto.subtle.importKey(
    "raw",
    hashedKey,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

export const encrypt = async (text: string, key: string): Promise<string> => {
  const encoded = new TextEncoder().encode(text);
  const cryptoKey = await deriveKey(key);

  const iv = new Uint8Array(16).fill(1);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", length: 256, iv },
    cryptoKey,
    encoded,
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

export const decrypt = async (
  encryptedText: string,
  key: string,
): Promise<string> => {
  const encrypted = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0),
  );

  const cryptoKey = await deriveKey(key);

  const iv = new Uint8Array(16).fill(1);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", length: 256, iv },
    cryptoKey,
    encrypted,
  );
  return new TextDecoder().decode(decrypted);
};
