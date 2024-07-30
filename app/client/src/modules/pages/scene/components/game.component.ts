import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  global,
} from "@tulib/tulip";
import { bubbleChatComponent, chatComponent } from "modules/chat";
import { Event } from "shared/enums";
import { System } from "system";
import { roomComponent } from "modules/room";
import { getRandomNumber } from "shared/utils";
import { Size } from "shared/types";

const CHAT_PADDING = {
  x: 12,
  y: 15,
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
  chat.on(DisplayObjectEvent.LOADED, () => {
    chat.setInputWidth(windowBounds.width - CHAT_PADDING.x * 2);
  });

  global.events.on(TulipEvent.RESIZE, (size: Size) => {
    chat.setPositionY(size.height - 15);
    chat.setInputWidth(size.width - 24);
  });

  let $room;
  let $bubbleChat;

  const removeOnLoadRoom = System.proxy.on<any>(Event.LOAD_ROOM, ({ room }) => {
    System.game.rooms.set(room);
    $room = roomComponent({ layout: room.layout });
    $container.add($room);

    $bubbleChat = bubbleChatComponent({ room: $room });
    $container.add($bubbleChat);
  });

  const removeOnLeaveRoom = System.proxy.on<any>(
    Event.LEAVE_ROOM,
    ({ room }) => {
      $container.remove($room, $bubbleChat);

      System.proxy.emit(Event.JOIN_ROOM, {
        roomId: `test_${getRandomNumber(0, 3)}`,
        // roomId: `test_1`,
      });
    },
  );

  $container.on(DisplayObjectEvent.DESTROYED, () => {
    removeOnLoadRoom?.();
    removeOnLeaveRoom?.();
  });

  return $container.getComponent(gameComponent);
};
