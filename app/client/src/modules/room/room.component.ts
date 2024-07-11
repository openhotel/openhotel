import { container, ContainerComponent, EventMode, sprite } from "@tulib/tulip";
import { getIsometricPosition } from "shared/utils";
import { Event, RoomPoint } from "shared/enums";
import { System } from "system";

type Props = {
  layout: RoomPoint[][];
};

type Mutable = {};

export const roomComponent: ContainerComponent<Props, Mutable> = async ({
  layout,
}) => {
  const $container = await container<{}, Mutable>();
  await $container.setPosition({ x: 300, y: 100 });

  const roomSize = {
    width: layout.length,
    depth: Math.max(...layout.map((line) => line.length)),
  };

  const rayCastTile = (
    x: number,
    z: number,
    subX: number,
    subZ: number,
  ): boolean => {
    const targetX = x - subX;
    const targetZ = z - subZ;

    if (0 > targetX || 0 > targetZ || !layout[targetZ]) return false;
    if (layout[targetZ][targetX] === RoomPoint.TILE) return true;

    return rayCastTile(targetX, targetZ, subX, subZ);
  };

  const rayCastLeft = (x: number, z: number): boolean => {
    x -= 1;

    if (0 > x || 0 > z) return false;
    if (layout[z] && layout[z][x] === RoomPoint.TILE) return true;

    return rayCastLeft(x, z);
  };

  for (let x = 0; x < roomSize.width; x++) {
    const roomLine = layout[x];
    for (let z = 0; z < roomSize.depth; z++) {
      if (!roomLine[z]) continue;

      const pos = getIsometricPosition({ x, z, y: 0 }, 12);

      //left side
      {
        if (!rayCastLeft(x, z)) {
          const wall = await sprite({
            texture: "wall_0.png",
          });
          await wall.setPivot({ x: 3, y: 98 });
          await wall.setPosition(pos);
          $container.add(wall);
        }
        // if (!rayCastTile(x, z, 1, 0)) {
        //   const wall = await sprite({
        //     texture: "wall_1.png",
        //   });
        //   await wall.setPivot({ x: -25, y: 98 });
        //   await wall.setPosition(pos);
        //   $container.add(wall);
        // }
      }

      const tile = await sprite({
        texture: "tile_v1.png",
      });
      await tile.setPosition(pos);
      await tile.setEventMode(EventMode.STATIC);

      tile.on("pointerdown", () => {
        System.proxy.emit(Event.POINTER_TILE, {
          position: {
            x,
            z,
          },
        });
      });

      await tile.setTint(
        roomLine[z] === RoomPoint.SPAWN
          ? 0x2f2f2f
          : (x + z) % 2 === 0
            ? 0xa49f7e
            : 0xb2ad8e,
      );
      $container.add(tile);
    }
  }

  return $container.getComponent(roomComponent);
};
