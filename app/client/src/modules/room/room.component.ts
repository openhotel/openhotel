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

  for (let x = 0; x < roomSize.width; x++) {
    const roomLine = layout[x];
    for (let z = 0; z < roomSize.depth; z++) {
      if (!roomLine[z]) continue;

      const tile = await sprite({
        texture: "tile_v1.png",
      });
      const pos = getIsometricPosition({ x, z, y: 0 }, 12);
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
