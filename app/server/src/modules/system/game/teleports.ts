import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";
import { ulid } from "@std/ulid";

export const teleports = () => {
  const setRoom = async (id: string, roomId: string) => {
    await System.db.set(["teleportsRoom", id], roomId);
  };

  const removeRoom = async (id: string) => {
    await System.db.delete(["teleportsRoom", id]);
  };

  const setLink = async (teleportIdA: string, teleportIdB: string) => {
    await System.db.set(["teleportsTo", teleportIdA], teleportIdB);
    await System.db.set(["teleportsTo", teleportIdB], teleportIdA);
  };

  const get = async (id: string) => {
    const to = await System.db.get(["teleportsTo", id]);
    const roomId = await System.db.get(["teleportsRoom", id]);

    if (!to || !roomId) return null;

    return {
      to,
      roomId,
    };
  };

  const remote = () => {
    const setLink = async (
      accountId: string,
      roomId: string,
      teleportId: string,
      linkId?: string,
    ) => {
      const $linkId = linkId ?? ulid();

      await System.onet.fetch({
        pathname: "/teleports/link",
        method: RequestMethod.POST,
        body: {
          accountId,
          linkId: $linkId,
          teleportId,
        },
      });

      await setRoom(teleportId, roomId);
      await System.db.set(["teleportsTo", teleportId], "onet");

      return { linkId: $linkId };
    };

    const get = async (
      teleportId: string,
    ): Promise<{
      teleportId: string;
      hotelId: string;
      integrationId: string;
    }> => {
      const { teleport } = await System.onet.fetch({
        pathname: `/teleports/get?teleportId=${teleportId}`,
        method: RequestMethod.GET,
      });
      return teleport;
    };

    return {
      setLink,
      get,
    };
  };

  return {
    setRoom,
    removeRoom,

    setLink,
    get,

    remote: remote(),
  };
};
