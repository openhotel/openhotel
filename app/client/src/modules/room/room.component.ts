import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  global,
  sprite,
} from "@tulib/tulip";
import { getIsometricPosition } from "shared/utils";
import { Event, RoomPoint } from "shared/enums";
import { System } from "system";
import { humanComponent } from "modules/human";

type Props = {
  layout: RoomPoint[][];
  addLog: (log: string) => void;
};

type Mutable = {
  getHumanList: () => any[];
};

export const roomComponent: ContainerComponent<Props, Mutable> = async ({
  layout,
  addLog,
}) => {
  const $container = await container<{}, Mutable>();
  $container.getDisplayObject().sortableChildren = true;
  await $container.setPosition({ x: 300, y: 100 });

  let humanList = [];

  System.proxy.on<any>(Event.ADD_HUMAN, async ({ user, position, isOld }) => {
    const human = await humanComponent({ user });
    await human.setIsometricPosition(position);
    humanList.push(human);
    $container.add(human);

    if (!isOld) addLog(`${user.username} joined!`);
  });
  System.proxy.on<any>(Event.REMOVE_HUMAN, ({ user }) => {
    const currentHuman = humanList.find(
      (human) => human.getUser().id === user.id,
    );
    $container.remove(currentHuman);
    humanList = humanList.filter((human) => human.getUser().id !== user.id);
    addLog(`${user.username} left!`);
  });
  System.proxy.on<any>(Event.MOVE_HUMAN, async ({ userId, position }) => {
    const human = humanList.find((human) => human.getUser().id === userId);

    human.setIsometricPosition({ ...position, y: 0 });
  });

  const roomSize = {
    width: layout.length,
    depth: Math.max(...layout.map((line) => line.length)),
  };

  const isWallRenderable = (x: number, z: number, isX: boolean): boolean => {
    if (layout[x][z] === RoomPoint.SPAWN || layout[x][z] === RoomPoint.EMPTY)
      return false;
    if ((!isX && x === 0) || (isX && z === 0)) return true;

    if (
      (isX && layout[x][z - 1] === RoomPoint.SPAWN) ||
      (!isX && layout[x - 1][z] === RoomPoint.SPAWN)
    )
      return false;

    for (let i = isX ? 0 : 1; i < x + 1; i++) {
      for (let j = isX ? 1 : 0; j < z + 1; j++) {
        const currentPoint = layout[x - i][z - j];
        if (currentPoint === RoomPoint.TILE) return false;
      }
    }

    return true;
  };

  for (let x = 0; x < roomSize.width; x++) {
    const roomLine = layout[x];
    for (let z = 0; z < roomSize.depth; z++) {
      if (!roomLine[z]) continue;

      const isSpawn = roomLine[z] === RoomPoint.SPAWN;

      const pos = getIsometricPosition({ x, z, y: 0 }, 12);

      //left side
      if (!isSpawn) {
        if (isWallRenderable(x, z, true)) {
          const wall = await sprite({
            texture: "wall_0.png",
            eventMode: EventMode.NONE,
          });
          await wall.setPivot({ x: 3, y: 98 });
          await wall.setZIndex(x + z - 0.2);
          await wall.setPosition(pos);
          $container.add(wall);
        }
        if (isWallRenderable(x, z, false)) {
          const wall = await sprite({
            texture: "wall_1.png",
          });
          await wall.setPivot({ x: -25, y: 98 });
          await wall.setZIndex(x + z - 0.2);
          await wall.setPosition(pos);
          $container.add(wall);
        }
      }

      const tile = await sprite({
        texture: "tile_v1.png",
      });
      await tile.setZIndex(x + z - 0.1);
      await tile.setPosition(pos);
      await tile.setEventMode(EventMode.STATIC);

      tile.on(DisplayObjectEvent.POINTER_DOWN, () => {
        global.context.clear();
        System.proxy.emit(Event.POINTER_TILE, {
          position: {
            x,
            z,
          },
        });
      });

      await tile.setTint(
        isSpawn ? 0x2f2f2f : (x + z) % 2 === 0 ? 0xa49f7e : 0xb2ad8e,
      );
      $container.add(tile);
    }
  }

  return $container.getComponent(roomComponent, {
    getHumanList: () => humanList,
  });
};
