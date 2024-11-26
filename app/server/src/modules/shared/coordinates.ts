import { Hemisphere } from "../../shared/enums/main.ts";
import { wait } from "@oh/utils";
import { ConfigTypes } from "shared/types/config.types.ts";

export const coordinates = () => {
  const defaultLatitude = 41.997548;
  // const defaultLongitude = 2.8197577;

  let $config: ConfigTypes;
  let ipMap: Record<string, [number, number]> = {};

  const load = (config: ConfigTypes) => {
    $config = config;
  };

  const get = async (ip: string, retries = 0): Promise<Hemisphere> => {
    if ($config.version === "development" || !ip)
      return getHemisphere(defaultLatitude);
    if (ipMap[ip]) return getHemisphere(ipMap[ip][0]);
    if (ip.startsWith("127.0.") || retries > 60)
      return getHemisphere(defaultLatitude);
    try {
      const { lat, lon } = await fetch(`http://ip-api.com/json/${ip}`).then(
        (response) => response.json(),
      );
      ipMap[ip] = [lat, lon];
      return getHemisphere(lat);
    } catch (_) {
      wait(1_000);
      return await get(ip, retries + 1);
    }
  };

  const getHemisphere = (latitude: number) =>
    latitude >= 0 ? Hemisphere.NORTH : Hemisphere.SOUTH;

  return {
    load,

    get,
    getHemisphere,
  };
};
