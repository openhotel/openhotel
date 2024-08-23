export const getEncodedText = (text: string): Uint8Array =>
  new TextEncoder().encode(text);

export const getDecodedText = (data: Uint8Array): string =>
  new TextDecoder().decode(data);
