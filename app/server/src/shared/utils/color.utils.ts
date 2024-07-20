// Function to generate random number in 0x000000 format from seed string
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
  const randomNumber =
    (hashArray[0] << 16) | (hashArray[1] << 8) | hashArray[2];

  return randomNumber;
};
