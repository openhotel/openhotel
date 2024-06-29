import { getRandomNumber } from "./random.utils.ts";

// min 49152
// max 65535
export const getFreePort = async (
  min: number = 50000,
  max: number = 55000,
): Promise<number> => {
  try {
    const targetPort = getRandomNumber(min, max);
    const listener = await Deno.listen({
      port: targetPort,
    });
    listener.close();
    return targetPort;
  } catch (e) {
    console.lo;
    return await getFreePort(min, max);
  }
};
