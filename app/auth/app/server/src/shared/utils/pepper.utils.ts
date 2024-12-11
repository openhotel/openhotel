const PEPPER_FILE = "database-priv";

/**
 * Get pepper from filesystem, if not found, create it
 */
export const getPasswordsPepper = async (): Promise<string> => {
  try {
    return await Deno.readTextFile(PEPPER_FILE);
  } catch {
    const pepper: string = crypto.randomUUID();
    await Deno.writeTextFile(PEPPER_FILE, pepper);
    return pepper;
  }
};

/**
 * Pepper is a value like salt, but is never stored on the database, so if the database is compromised, you still need the pepper to guess the passwords.
 * @see https://en.wikipedia.org/wiki/Pepper_(cryptography)
 */
export const pepperPassword = async (pass: string): Promise<string> => {
  const pepper = await getPasswordsPepper();
  return pepper + ":" + pass;
};
