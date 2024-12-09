import { Point3d } from "@oh/utils";

export const teleports = () => {
  const roomMap: Record<string, [number, number, number, number][]> = {};

  const createLocal = (
    roomId: string,
    x1: number,
    z1: number,
    x2: number,
    z2: number,
  ) => {
    if (!roomMap[roomId]) roomMap[roomId] = [];

    roomMap[roomId].push([x1, z1, x2, z2]);
    console.log(roomMap);
  };

  const getLocal = (
    roomId: string,
    { x, z }: Point3d,
  ): null | [number, number] => {
    const foundPosition = roomMap[roomId]?.find(
      ([x1, z1, x2, z2]) => (x === x1 && z === z1) || (x === x2 && z === z2),
    );
    if (!foundPosition) return null;
    const [x1, z1, x2, z2] = foundPosition;

    return x1 === x && z1 === z ? [x2, z2] : [x1, z1];
  };

  return {
    createLocal,
    getLocal,
  };
};
