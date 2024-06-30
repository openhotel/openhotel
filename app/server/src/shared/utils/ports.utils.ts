import { getRandomNumber } from "./random.utils.ts";
import { getConfig } from "shared/utils/config.utils.ts";

// min 49152
// max 65535
export const getFreePort = async (
  min?: number,
  max?: number,
): Promise<number> => {
  if (!min || !max) {
    const {
      ports: { range },
    } = await getConfig();
    if (!min) min = range[0];
    if (!max) min = range[1];
  }
  try {
    const targetPort = getRandomNumber(min, max);
    const listener = await Deno.listen({
      port: targetPort,
    });
    listener.close();
    return targetPort;
  } catch (e) {
    return await getFreePort(min, max);
  }
};
