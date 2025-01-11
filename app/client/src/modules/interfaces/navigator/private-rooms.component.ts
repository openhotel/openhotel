import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  nineSliceSprite,
  scrollableContainer,
  sprite,
  textSprite,
} from "@tu/tulip";
import { Event, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { Size2d } from "shared/types";
import {createLogger} from "vite";

type Props = {
  size: Size2d;
};

export const privateRoomsComponent: ContainerComponent<Props> = (props) => {
  const $container = container(props);

  const $text = textSprite({
    text: `PRIVATE`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 0,
    },
  });
  $container.add($text);

  let roomTextList = [];

  const { size } = $container.getProps();

  const $roomList = scrollableContainer({
    position: {
      x: 0,
      y: 10,
    },
    size: {
      width: size.width - 10,
      height: size.height - 10,
    },
    jump: 3,
    verticalScroll: true,
    horizontalScroll: false,
    components: [
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-bottom",
        scale: {
          y: -1,
          x: 1,
        },
        pivot: {
          x: 0,
          y: 9,
        },
      }),
    ],
  });
  $container.add($roomList);

  const loadRooms = async () => {
    const targetRoomTextList = [];
    const { rooms } = await System.api.fetch<{
      rooms: {
        id: string;
        title: string;
        description: string;
        userCount: number;
      }[];
    }>("/room-list", {
      type: "private",
    });

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      const $container = container({
        position: {
          x: 0,
          y: i * 14,
        },
        cursor: Cursor.POINTER,
        eventMode: EventMode.STATIC,
      });

      const $background = nineSliceSprite({
        spriteSheet: SpriteSheetEnum.NAVIGATOR,
        texture: "bubble-9",
        leftWidth: 4,
        topHeight: 4,
        rightWidth: 4,
        bottomHeight: 4,
        width: size.width - 15,
        height: 9,
        zIndex: -2,
        tint: 0xd2d3d7,
      });

      const $joinRoomText = textSprite({
        text: `${room.title} (${room.userCount})`,
        tint: 0,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        position: {
          x: 6,
          y: 2,
        },
        eventMode: EventMode.NONE,
      });
      $container.add($background, $joinRoomText);

      $container.on(DisplayObjectEvent.POINTER_TAP, async () => {
        System.loader.start();
        System.proxy.emit(Event.PRE_JOIN_ROOM, {
          roomId: room.id,
        });

        System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
      });
      targetRoomTextList.push($container);
    }
    $roomList.add(...targetRoomTextList);
    $roomList.remove(...roomTextList);
    roomTextList = targetRoomTextList;
  };

  let reloadInterval;

  $container.on(DisplayObjectEvent.MOUNT, async () => {
    await loadRooms();

    reloadInterval = setInterval(() => {
      if (!$container.getVisible()) return;
      loadRooms();
    }, 30_000);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, async () => {
    clearInterval(reloadInterval);
  });

  return $container.getComponent(privateRoomsComponent);
};
