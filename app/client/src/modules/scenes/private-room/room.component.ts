import {
  container,
  ContainerComponent,
  ContainerMutable,
  Cursor,
  DisplayObjectEvent,
  DisplayObjectMutable,
  EventMode,
  global,
  graphics,
  GraphicType,
  sprite,
} from "@tu/tulip";
import { getPositionFromIsometricPosition, getTilePolygon } from "shared/utils";
import {
  Event,
  FurnitureType,
  RoomPointEnum,
  SpriteSheetEnum,
  SystemEvent,
} from "shared/enums";
import { RoomFurniture, RoomFurnitureFrame } from "shared/types";
import { System } from "system";
import { humanComponent, HumanMutable } from "modules/human";
import {
  STEP_TILE_HEIGHT,
  TILE_Y_HEIGHT,
  WALL_DOOR_HEIGHT,
  WALL_HEIGHT,
} from "shared/consts";
import { wallComponent } from "./wall.component";
import { furnitureComponent, FurnitureMutable } from "./furniture.component";
import { furnitureFrameComponent } from "./furniture-frame.component";

type Props = {};

export type RoomMutable = {
  getHumanList: () => HumanMutable[];
};

export const roomComponent: ContainerComponent<Props, RoomMutable> = () => {
  const { layout, furniture } = System.game.rooms.get();
  const furnituresMap: Record<string, FurnitureMutable> = {};
  const $container = container<{}, RoomMutable>({
    sortableChildren: true,
    pivot: {
      x: 0,
      y: -WALL_HEIGHT / 2,
    },
  });
  $container.on(
    DisplayObjectEvent.ADD_CHILD,
    (component: DisplayObjectMutable<any>) => {
      const position = component.getPosition();
      const containerPivot = $container.getPivot();

      if (containerPivot.x > position.x) $container.setPivotX(position.x - 4);
      if (containerPivot.y > position.y)
        $container.setPivotY(position.y - WALL_HEIGHT);
    },
  );
  // $container.setPosition({ x: 230, y: 100 });

  // const $coords = textSprite({
  //   spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
  //   text: "0.0",
  //   position: {
  //     x: 180,
  //     y: 300,
  //   },
  // });
  // $container.add($coords);

  let humanList: ContainerMutable<{}, HumanMutable>[] = [];

  let removeOnLeaveRoom;
  let removeOnAddHuman;
  let removeOnRemoveHuman;
  let removeOnMoveHuman;
  let removeOnSetPositionHuman;
  let removeOnStopHuman;
  let removeOnAddFurniture;
  let removeOnRemoveFurniture;

  const onRemove = () => {
    removeOnAddHuman?.();
    removeOnRemoveHuman?.();
    removeOnMoveHuman?.();
    removeOnLeaveRoom?.();
    removeOnSetPositionHuman?.();
    removeOnStopHuman?.();

    removeOnAddFurniture?.();
    removeOnRemoveFurniture?.();
  };

  $container.on(DisplayObjectEvent.REMOVED, onRemove);
  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnAddHuman = System.proxy.on<any>(Event.ADD_HUMAN, ({ user }) => {
      const human = humanComponent({ user });
      humanList.push(human);
      $container.add(human);
    });
    removeOnRemoveHuman = System.proxy.on<any>(
      Event.REMOVE_HUMAN,
      ({ accountId }) => {
        const currentHuman = humanList.find(
          (human) => human.getUser().accountId === accountId,
        );
        $container.remove(currentHuman);
        humanList = humanList.filter(
          (human) => human.getUser().accountId !== accountId,
        );
      },
    );
    removeOnMoveHuman = System.proxy.on<any>(
      Event.MOVE_HUMAN,
      ({ accountId, position, bodyDirection }) => {
        const human = humanList.find(
          (human) => human.getUser().accountId === accountId,
        );

        human.moveTo(position, bodyDirection);
      },
    );
    removeOnSetPositionHuman = System.proxy.on<any>(
      Event.SET_POSITION_HUMAN,
      ({ accountId, position }) => {
        const human = humanList.find(
          (human) => human.getUser().accountId === accountId,
        );

        human.setIsometricPosition(position);
      },
    );
    removeOnAddFurniture = System.proxy.on<any>(
      Event.ADD_FURNITURE,
      ({ furniture }) => {
        $addFurniture(furniture);
      },
    );
    removeOnRemoveFurniture = System.proxy.on<any>(
      Event.REMOVE_FURNITURE,
      ({ furniture }) => {
        $removeFurniture(furniture);
      },
    );

    const roomSize = {
      width: Math.max(...layout.map((line) => line.length)),
      depth: layout.length,
    };

    const $tilePreview = sprite({
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
      if (!layout[z]) return false;
      if (
        layout[z][x] === RoomPointEnum.SPAWN ||
        layout[z][x] === RoomPointEnum.EMPTY
      )
        return false;

      if (
        (!isX && layout[z][x - 1] === RoomPointEnum.SPAWN) ||
        (isX && layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN)
      )
        return false;

      for (let j = isX ? 1 : 0; j < z + 1; j++) {
        for (let i = isX ? 0 : 1; i < x + 1; i++) {
          const currentPoint = layout[z - j][x - i];
          if (!isNaN(parseInt(currentPoint))) return false;
        }
      }

      return true;
    };

    for (let z = 0; z < roomSize.depth; z++) {
      const roomLine = layout[z];
      for (let x = 0; x < roomSize.width; x++) {
        if (roomLine[x] === RoomPointEnum.EMPTY) continue;

        const isSpawn = roomLine[x] === RoomPointEnum.SPAWN;

        const previewY = -(
          (isSpawn ? 1 : (parseInt(roomLine[x] + "") ?? 1)) - 1
        );
        const y = Math.floor(previewY);

        const isXStairs = roomLine[x] > roomLine[x - 1];
        const isZStairs = roomLine[x] > layout[z - 1]?.[x];

        const previewPosition = getPositionFromIsometricPosition({
          x,
          z,
          y: previewY + (isXStairs || isZStairs ? 0.5 : 0),
        });

        const position = getPositionFromIsometricPosition({ x, z, y });
        const wallPosition = getPositionFromIsometricPosition({ x, z, y: 0 });

        const wallHeight = WALL_HEIGHT - y * TILE_Y_HEIGHT;
        const zIndex = x + z;

        //left side
        if (!isSpawn) {
          const isWallXRenderable = isWallRenderable(x, z, false);
          const isWallZRenderable = isWallRenderable(x, z, true);

          if (isWallXRenderable) {
            const wall = wallComponent({
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
            const wall = wallComponent({
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
            const wall = sprite({
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

          if (layout[z][x - 1] === RoomPointEnum.SPAWN) {
            const wall = wallComponent({
              axis: "x",
              zIndex: zIndex - 0.1,
              pivot: { x: 5, y: 99 },
              position,
              tint: 0xc4d3dd,
              height: WALL_DOOR_HEIGHT,
            });
            $container.add(wall);
          }
          if (layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN) {
            const wall = wallComponent({
              axis: "z",
              zIndex: zIndex - 0.1,
              pivot: { x: -25, y: 99 },
              position,
              tint: 0xc4d3dd,
              height: WALL_DOOR_HEIGHT,
            });
            $container.add(wall);
          }
        }

        //detect stairs
        if (isXStairs || isZStairs) {
          const stairs = sprite({
            spriteSheet: SpriteSheetEnum.ROOM,
            texture: `stairs-${isXStairs ? "x" : "z"}`,
            eventMode: EventMode.NONE,
            tint: isSpawn ? 0x2f2f2f : zIndex % 2 === 0 ? 0xa49f7e : 0xb2ad8e,
            zIndex: zIndex - 0.1,
            position,
            pivot: {
              x: 0,
              y: TILE_Y_HEIGHT - STEP_TILE_HEIGHT,
            },
          });
          $container.add(stairs);
        } else {
          const tile = sprite({
            spriteSheet: SpriteSheetEnum.ROOM,
            texture: "tile",
            eventMode: EventMode.NONE,
            tint: isSpawn ? 0x2f2f2f : zIndex % 2 === 0 ? 0xa49f7e : 0xb2ad8e,
            zIndex: zIndex - 0.1,
            position,
          });
          $container.add(tile);
        }

        const pol = graphics({
          type: GraphicType.POLYGON,
          polygon: getTilePolygon({ width: 12, height: 12 }),
          tint: 0xff00ff,
          zIndex: zIndex,
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
          global.context.blur();
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
          System.events.emit(SystemEvent.CURSOR_COORDS, {
            position: { x, y, z },
          });
        });
        pol.on(DisplayObjectEvent.POINTER_LEAVE, () =>
          $tilePreview.setVisible(false),
        );

        $container.add(pol);
      }
    }

    //rooms
    const $addFurniture = (...furniture: RoomFurniture[]) => {
      for (const {
        id,
        uid,
        position,
        direction,
        type,
        ...props
      } of furniture) {
        let $furniture;
        switch (type) {
          case FurnitureType.FURNITURE:
            $furniture = furnitureComponent({
              furniture: id,
              isometricPosition: position,
              id: uid,
              direction,
            });
            $container.add(...$furniture.getSpriteList());
            break;
          case FurnitureType.FRAME:
            $furniture = furnitureFrameComponent({
              direction,
              furniture: id,
              isometricPosition: position,
              framePosition: (props as RoomFurnitureFrame).framePosition,
            });
            $container.add($furniture);
            break;
        }

        furnituresMap[uid] = $furniture;
      }
    };

    const $removeFurniture = (furniture: RoomFurniture) => {
      if (furnituresMap[furniture.uid]) {
        //@ts-ignore
        furnituresMap[furniture.uid].$destroy();
        delete furnituresMap[furniture.uid];
      }
    };

    $addFurniture(...furniture);
  });

  return $container.getComponent(roomComponent, {
    getHumanList: () => humanList,
  });
};
