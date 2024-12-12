import { System } from "modules/system/main.ts";

export const teleports = () => {
  const $linkMap: Record<string, string> = {};

  const link = async (
    linkId: string,
    teleportId: string,
    hotelId: string,
    integrationId: string,
  ): Promise<boolean> => {
    // check if teleport already is in the map
    if (await System.db.get(["teleport", teleportId])) return false;

    await System.db.set(["teleport", teleportId], { hotelId, integrationId });

    // if link doesnt exist, create (first step)
    if (!$linkMap[linkId]) {
      $linkMap[linkId] = teleportId;
      return true;
    }

    //if link already exists, create teleport link
    await System.db.set(["teleportsTo", teleportId], $linkMap[linkId]);
    await System.db.set(["teleportsTo", $linkMap[linkId]], teleportId);

    delete $linkMap[linkId];
    return true;
  };

  const get = async (
    teleportId: string,
  ): Promise<{
    teleportId: string;
    hotelId: string;
    integrationId: string;
  } | null> => {
    const teleportsTo = (await System.db.get([
      "teleportsTo",
      teleportId,
    ])) as any;
    const teleportData = (await System.db.get([
      "teleport",
      teleportsTo,
    ])) as any;

    if (!teleportsTo || !teleportData) return null;

    return {
      hotelId: teleportData.hotelId,
      integrationId: teleportData.integrationId,
      teleportId: teleportsTo,
    };
  };

  return {
    link,
    get,
  };
};
