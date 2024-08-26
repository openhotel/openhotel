import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  global,
} from "@tu/tulip";
import {
  bubbleChatComponent,
  chatComponent,
  systemMessageComponent,
} from "modules/chat";
import { Event } from "shared/enums";
import { System } from "system";
import { previewComponent, roomComponent } from "modules/room";
import { getRandomNumber } from "shared/utils";
import { LoadRoomEvent, Size2d } from "shared/types";

const CHAT_PADDING = {
  x: 12,
  y: 15,
};

const PREVIEW_PADDING = {
  x: 80,
  y: 180,
};

export const gameComponent: ContainerComponent = () => {
  const $container = container();

  const windowBounds = global.getApplication().window.getBounds();

  const chat = chatComponent({
    position: {
      x: CHAT_PADDING.x,
      y: windowBounds.height - CHAT_PADDING.y,
    },
    zIndex: 1_000,
  });
  $container.add(chat);

  const systemMessage = systemMessageComponent({
    position: {
      x: 0,
      y: windowBounds.height - CHAT_PADDING.y - 24,
    },
  });
  $container.add(systemMessage);

  const $preview = previewComponent({
    position: {
      x: windowBounds.width - PREVIEW_PADDING.x,
      y: windowBounds.height - PREVIEW_PADDING.y,
    },
  });
  $container.add($preview);

  chat.setInputWidth(windowBounds.width - CHAT_PADDING.x * 2);

  global.events.on(TulipEvent.RESIZE, (size: Size2d) => {
    chat.setPositionY(size.height - CHAT_PADDING.y);
    chat.setInputWidth(size.width - CHAT_PADDING.x * 2);

    systemMessage.setPositionY(size.height - CHAT_PADDING.y - 24);

    $preview.setPosition({
      x: size.width - PREVIEW_PADDING.x,
      y: size.height - PREVIEW_PADDING.y,
    });
  });

  let $room;
  let $bubbleChat;

  const loadRoomPosition = () => {
    const size = global.getApplication().window.getBounds();
    const roomBounds = $room.getBounds();

    $room.setPosition({
      x: size.width / 2 - roomBounds.width / 2,
      y: size.height / 2 - roomBounds.height / 2,
    });

    $bubbleChat.setPositionX(size.width / 2);
  };

  const removeOnLoadRoom = System.proxy.on<LoadRoomEvent>(
    Event.LOAD_ROOM,
    ({ room }) => {
      System.game.rooms.set(room);
      $room = roomComponent({ room });
      $container.add($room);

      $bubbleChat = bubbleChatComponent({ room: $room });
      $container.add($bubbleChat);
      loadRoomPosition();
    },
  );

  global.events.on(TulipEvent.RESIZE, loadRoomPosition);

  const removeOnLeaveRoom = System.proxy.on<any>(Event.LEAVE_ROOM, () => {
    $container.remove($room, $bubbleChat);

    System.proxy.emit(Event.JOIN_ROOM, {
      roomId: `test_${getRandomNumber(0, 5)}`,
      // roomId: `test_1`,
    });
  });

  $container.on(DisplayObjectEvent.DESTROYED, () => {
    removeOnLoadRoom?.();
    removeOnLeaveRoom?.();
  });

  return $container.getComponent(gameComponent);
};
