import { Hemisphere } from "shared/enums";

export const coordinates = () => {
  let latitude = 41.997548;
  let longitude = 2.8197577;

  const load = async () => {
    try {
      const { lat, lon } = await fetch("http://ip-api.com/json").then(
        (response) => response.json(),
      );
      latitude = lat;
      longitude = lon;
    } catch (_) {}
  };

  const getLatitude = () => latitude;
  const getLongitude = () => longitude;

  const getHemisphere = () =>
    latitude >= 0 ? Hemisphere.NORTH : Hemisphere.SOUTH;

  return {
    load,

    getLatitude,
    getLongitude,
    getHemisphere,
  };
};
