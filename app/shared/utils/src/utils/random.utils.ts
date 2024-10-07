export const getRandomNumber = (min: number, max: number): number =>
  Math.round(Math.random() * (max - min)) + min;

export const getRandomString = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const getRandomNumberFromSeed = async (
  seed: string,
): Promise<number> => {
  // Encode the seed string as a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);

  // Create a SHA-256 hash from the seed string
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  // Extract the first 3 bytes of the hash and convert to a number
  return (hashArray[0] << 16) | (hashArray[1] << 8) | hashArray[2];
};
