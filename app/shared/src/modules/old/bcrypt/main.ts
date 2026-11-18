import * as bcrypt from "@shared/modules/old/bcrypt/bcrypt.ts";

/**
 * Generate a hash for the plaintext password
 * Requires the --allow-net flag
 *
 * @export
 * @param {string} plaintext The password to hash
 * @param {(string | undefined)} [salt=undefined] The salt to use when hashing. Recommended to leave this undefined.
 * @returns {Promise<string>} The hashed password
 */
export async function hash(
  plaintext: string,
  salt: string | undefined = undefined,
): Promise<string> {
  // Convert the plaintext to a Buffer to measure its byte length
  const byteLength = new TextEncoder().encode(plaintext).length;

  // Check if it exceeds the 72-byte limit
  if (byteLength > 72)
    throw new Error("Password exceeds bcrypt's 72-byte limit");

  let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), {
    type: "module",
  });

  worker.postMessage({
    action: "hash",
    payload: {
      plaintext,
      salt,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Generates a salt using a number of log rounds
 * Requires the --allow-net flag
 *
 * @export
 * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {Promise<string>} The generated salt
 */
export async function genSalt(
  log_rounds: number | undefined = undefined,
): Promise<string> {
  let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), {
    type: "module",
  });

  worker.postMessage({
    action: "genSalt",
    payload: {
      log_rounds,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Check if a plaintext password matches a hash
 * Requires the --allow-net flag
 *
 * @export
 * @param {string} plaintext The plaintext password to check
 * @param {string} hash The hash to compare to
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export async function compare(
  plaintext: string,
  hash: string,
): Promise<boolean> {
  let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), {
    type: "module",
  });

  worker.postMessage({
    action: "compare",
    payload: {
      plaintext,
      hash,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Check if a plaintext password matches a hash
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {string} plaintext The plaintext password to check
 * @param {string} hash The hash to compare to
 * @returns {boolean} Whether the password matches the hash
 */
export function compareSync(plaintext: string, hash: string): boolean {
  try {
    return bcrypt.checkpw(plaintext, hash);
  } catch {
    return false;
  }
}

/**
 * Generates a salt using a number of log rounds
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {string} The generated salt
 */
export function genSaltSync(
  log_rounds: number | undefined = undefined,
): string {
  return bcrypt.gensalt(log_rounds);
}

/**
 * Generate a hash for the plaintext password
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {string} plaintext The password to hash
 * @param {(string | undefined)} [salt=undefined] The salt to use when hashing. Recommended to leave this undefined.
 * @returns {string} The hashed password
 */
export function hashSync(
  plaintext: string,
  salt: string | undefined = undefined,
): string {
  // Convert the plaintext to a Buffer to measure its byte length
  const byteLength = new TextEncoder().encode(plaintext).length;

  // Check if it exceeds the 72-byte limit
  if (byteLength > 72)
    throw new Error("Password exceeds bcrypt's 72-byte limit");

  return bcrypt.hashpw(plaintext, salt);
}
