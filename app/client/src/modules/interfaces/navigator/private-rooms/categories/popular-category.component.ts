import {
  container,
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

export const popularCategoryComponent = () => {
  const $container = container();
  const $content = container({
    position: {
      x: 6,
      y: 7,
    },
  });

  const $backgroundModal = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-2",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: 201,
    height: 165,
    eventMode: EventMode.STATIC,
  });
  $container.add($backgroundModal, $content);

  const $roomList = scrollableContainer({
    position: {
      x: 0,
      y: 10,
    },
    size: {
      width: 180,
      height: 73,
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

  const text = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "popular",
    tint: 0,
  });
  $content.add($roomList, text);

  let roomTextList = [];

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
      const $joinRoomText = textSprite({
        text: `join ${room.title} (${room.userCount})`,
        tint: 0,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        position: {
          x: 0,
          y: i * 14,
        },
        cursor: Cursor.POINTER,
        eventMode: EventMode.STATIC,
      });
      $joinRoomText.on(DisplayObjectEvent.POINTER_TAP, () => {
        System.proxy.emit(Event.JOIN_ROOM, {
          roomId: room.id,
        });
        System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
      });
      targetRoomTextList.push($joinRoomText);
    }
    $roomList.add(...targetRoomTextList);
    $roomList.remove(...roomTextList);
    roomTextList = targetRoomTextList;
  };

  let reloadInterval;

  $container.on(DisplayObjectEvent.MOUNT, async () => {
    loadRooms();

    reloadInterval = setInterval(() => {
      if (!$container.getVisible()) return;
      loadRooms();
    }, 30_000);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, async () => {
    clearInterval(reloadInterval);
  });

  return $container.getComponent(popularCategoryComponent);
};
