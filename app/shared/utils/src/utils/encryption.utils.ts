const deriveKey = async (key: string): Promise<CryptoKey> => {
  const hashedKey = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key),
  );

  return crypto.subtle.importKey("raw", hashedKey, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
};

export const encrypt = async (text: string, key: string): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await deriveKey(key);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    new TextEncoder().encode(text),
  );

  return btoa(
    String.fromCharCode(...iv) +
      String.fromCharCode(...new Uint8Array(encrypted)),
  );
};

export const decrypt = async (
  encryptedText: string,
  key: string,
): Promise<string> => {
  const data = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);
  const cryptoKey = await deriveKey(key);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedData,
  );

  return new TextDecoder().decode(decrypted);
};
