import {
  container,
  ContainerComponent,
  ContainerMutable,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  sprite,
} from "@tulib/tulip";
import {
  delay,
  getIsometricPosition,
  getTilePolygon,
  interpolatePath,
} from "shared/utils";
import { Event, RoomPointEnum, SpriteSheetEnum } from "shared/enums";
import { RoomPoint } from "shared/types";
import { System } from "system";
import { humanComponent, HumanMutable } from "modules/human";
import {
  TILE_WIDTH,
  TILE_Y_HEIGHT,
  WALL_DOOR_HEIGHT,
  WALL_HEIGHT,
} from "shared/consts";
import { wallComponent } from "modules/room/components/wall.component";

type Props = {
  layout: RoomPoint[][];
};

type Mutable = {
  getHumanList: () => HumanMutable[];
};

export type RoomMutable = ContainerMutable<Props, Mutable>;

export const roomComponent: ContainerComponent<Props, Mutable> = async ({
  layout,
}) => {
  const $container = await container<{}, Mutable>({
    sortableChildren: true,
  });
  await $container.setPosition({ x: 230, y: 100 });

  let humanList: ContainerMutable<{}, HumanMutable>[] = [];

  let removeOnLeaveRoom;
  let removeOnAddHuman;
  let removeOnRemoveHuman;
  let removeOnMoveHuman;

  const onRemove = () => {
    removeOnAddHuman?.();
    removeOnRemoveHuman?.();
    removeOnMoveHuman?.();
    removeOnLeaveRoom?.();
  };

  $container.on(DisplayObjectEvent.REMOVED, onRemove);
  $container.on(DisplayObjectEvent.ADDED, async () => {
    removeOnAddHuman = System.proxy.on<any>(
      Event.ADD_HUMAN,
      async ({ user, position, isOld }) => {
        const human = await humanComponent({ user });
        await human.setIsometricPosition(position);
        humanList.push(human);
        $container.add(human);
      },
    );
    removeOnRemoveHuman = System.proxy.on<any>(
      Event.REMOVE_HUMAN,
      ({ user }) => {
        const currentHuman = humanList.find(
          (human) => human.getUser().id === user.id,
        );
        $container.remove(currentHuman);
        humanList = humanList.filter((human) => human.getUser().id !== user.id);
      },
    );
    removeOnMoveHuman = System.proxy.on<any>(
      Event.MOVE_HUMAN,
      async ({ userId, path }) => {
        const human = humanList.find((human) => human.getUser().id === userId);
        const fullPath = interpolatePath(path);
        for (const step of fullPath) {
          await human.setIsometricPosition({ x: step.x, z: step.y, y: 0 });
          //TODO Implement loop
          await delay(150);
        }
      },
    );

    const roomSize = {
      width: layout.length,
      depth: Math.max(...layout.map((line) => line.length)),
    };

    const $tilePreview = await sprite({
      spriteSheet: SpriteSheetEnum.ROOM,
      texture: "tile_preview",
      eventMode: EventMode.NONE,
      visible: false,
      pivot: {
        x: -2,
        y: 0,
      },
    });
    $container.add($tilePreview);

    const isWallRenderable = (x: number, z: number, isX: boolean): boolean => {
      if (!layout[x]) return false;
      if (
        layout[x][z] === RoomPointEnum.SPAWN ||
        layout[x][z] === RoomPointEnum.EMPTY
      )
        return false;

      if (
        (isX && layout[x][z - 1] === RoomPointEnum.SPAWN) ||
        (!isX && layout[x - 1] && layout[x - 1][z] === RoomPointEnum.SPAWN)
      )
        return false;

      for (let i = isX ? 0 : 1; i < x + 1; i++) {
        for (let j = isX ? 1 : 0; j < z + 1; j++) {
          const currentPoint = layout[x - i][z - j];
          if (!isNaN(parseInt(currentPoint))) return false;
        }
      }

      return true;
    };

    for (let x = 0; x < roomSize.width; x++) {
      const roomLine = layout[x];
      for (let z = 0; z < roomSize.depth; z++) {
        if (roomLine[z] === RoomPointEnum.EMPTY) continue;

        const isSpawn = roomLine[z] === RoomPointEnum.SPAWN;

        const y = System.game.rooms.getYFromPoint({ x, z });

        const previewY = System.game.rooms.getYFromPoint({ x, z }, true);
        const previewPosition = getIsometricPosition(
          { x, z, y: previewY },
          TILE_WIDTH,
        );

        const position = getIsometricPosition({ x, z, y }, TILE_WIDTH);
        const wallPosition = getIsometricPosition({ x, z, y: 0 }, TILE_WIDTH);

        const wallHeight = WALL_HEIGHT - y * 2;
        const zIndex = x + z;

        //left side
        if (!isSpawn) {
          const isWallXRenderable = isWallRenderable(x, z, true);
          const isWallZRenderable = isWallRenderable(x, z, false);

          if (isWallXRenderable) {
            const wall = await wallComponent({
              axis: "x",
              zIndex: zIndex - 0.2,
              pivot: { x: 5, y: 99 },
              position: wallPosition,
              tint: 0xc4d3dd,
              height: wallHeight,
            });
            $container.add(wall);
          }
          if (isWallZRenderable) {
            const wall = await wallComponent({
              axis: "z",
              zIndex: zIndex - 0.2,
              pivot: { x: -25, y: 99 },
              position: wallPosition,
              tint: 0xc4d3dd,
              height: wallHeight,
            });
            $container.add(wall);
          }
          if (isWallXRenderable && isWallZRenderable) {
            const wall = await sprite({
              spriteSheet: SpriteSheetEnum.ROOM,
              texture: "wall-b",
              eventMode: EventMode.NONE,
              tint: 0xc4d3dd,
              pivot: { x: -20, y: 102 },
              zIndex: zIndex - 0.1,
              position: wallPosition,
            });
            $container.add(wall);
          }

          if (layout[x - 1] && layout[x - 1][z] === RoomPointEnum.SPAWN) {
            const wall = await wallComponent({
              axis: "z",
              zIndex: zIndex - 0.1,
              pivot: { x: -25, y: 99 },
              position,
              tint: 0xc4d3dd,
              height: WALL_DOOR_HEIGHT,
            });
            $container.add(wall);
          }
          if (layout[x][z - 1] === RoomPointEnum.SPAWN) {
            const wall = await wallComponent({
              axis: "x",
              zIndex: zIndex - 0.1,
              pivot: { x: 5, y: 99 },
              position,
              tint: 0xc4d3dd,
              height: WALL_DOOR_HEIGHT,
            });
            $container.add(wall);
          }
        }

        //detect stairs
        const isXStairs = roomLine[z] > roomLine[z - 1];
        const isZStairs = roomLine[z] > layout[x - 1]?.[z];
        if (isXStairs || isZStairs) {
          const stairs = await sprite({
            spriteSheet: SpriteSheetEnum.ROOM,
            texture: `stairs-${isXStairs ? "x" : "z"}`,
            eventMode: EventMode.NONE,
            tint: isSpawn ? 0x2f2f2f : zIndex % 2 === 0 ? 0xa49f7e : 0xb2ad8e,
            zIndex: zIndex - 0.1,
            position,
            pivot: {
              x: 0,
              y: TILE_Y_HEIGHT * 2 - 6,
            },
          });
          $container.add(stairs);
        } else {
          const tile = await sprite({
            spriteSheet: SpriteSheetEnum.ROOM,
            texture: "tile",
            eventMode: EventMode.NONE,
            tint: isSpawn ? 0x2f2f2f : zIndex % 2 === 0 ? 0xa49f7e : 0xb2ad8e,
            zIndex: zIndex - 0.1,
            position,
          });
          $container.add(tile);
        }

        const pol = await graphics({
          type: GraphicType.POLYGON,
          polygon: getTilePolygon({ width: 12, height: 12 }),
          tint: 0xff00ff,
          zIndex: 1000,
          eventMode: EventMode.STATIC,
          cursor: Cursor.POINTER,
          pivot: {
            x: -26,
            y: 0,
          },
          alpha: 0,
          position: previewPosition,
        });

        pol.on(DisplayObjectEvent.POINTER_UP, () => {
          global.context.clear();
          System.proxy.emit(Event.POINTER_TILE, {
            position: {
              x,
              z,
            },
          });
        });
        pol.on(DisplayObjectEvent.POINTER_ENTER, () => {
          $tilePreview.setPosition(previewPosition);
          $tilePreview.setZIndex(zIndex - 0.05);
          $tilePreview.setVisible(true);
        });
        pol.on(DisplayObjectEvent.POINTER_LEAVE, () =>
          $tilePreview.setVisible(false),
        );

        $container.add(pol);
      }
    }
  });

  return $container.getComponent(roomComponent, {
    getHumanList: () => humanList,
  });
};
