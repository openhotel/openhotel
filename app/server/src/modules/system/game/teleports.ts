import { System } from "modules/system/main.ts";

export const teleports = () => {
  // const roomMap: Record<string, [number, number, number, number][]> = {};
  //
  // const createLocal = (
  //   roomId: string,
  //   x1: number,
  //   z1: number,
  //   x2: number,
  //   z2: number,
  // ) => {
  //   if (!roomMap[roomId]) roomMap[roomId] = [];
  //
  //   roomMap[roomId].push([x1, z1, x2, z2]);
  //   console.log(roomMap);
  // };
  //
  // const getLocal = (
  //   roomId: string,
  //   { x, z }: Point3d,
  // ): null | [number, number] => {
  //   const foundPosition = roomMap[roomId]?.find(
  //     ([x1, z1, x2, z2]) => (x === x1 && z === z1) || (x === x2 && z === z2),
  //   );
  //   if (!foundPosition) return null;
  //   const [x1, z1, x2, z2] = foundPosition;
  //
  //   return x1 === x && z1 === z ? [x2, z2] : [x1, z1];
  // };

  let previousTeleportId: string = null;

  const setRoom = async (id: string, roomId: string) => {
    console.log(id, roomId, "<<<<<<");
    await System.db.set(["teleportsRoom", id], roomId);
  };

  const removeRoom = async (id: string) => {
    await System.db.delete(["teleportsRoom", id]);
  };

  const setLink = async (id: string) => {
    if (previousTeleportId === id) return;

    if (previousTeleportId) {
      await System.db.set(["teleportsTo", previousTeleportId], id);
      await System.db.set(["teleportsTo", id], previousTeleportId);
      previousTeleportId = null;
      return;
    }
    previousTeleportId = id;
  };

  const get = async (id: string) => {
    const to = await System.db.get(["teleportsTo", id]);
    const roomId = await System.db.get(["teleportsRoom", id]);

    return {
      to,
      roomId,
    };
  };

  return {
    setRoom,
    removeRoom,

    setLink,
    get,
  };
};
