import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  global,
  Event as TulipEvent,
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

export const gameComponent: ContainerComponent = async () => {
  const $container = await container();

  const windowBounds = global.getApplication().window.getBounds();

  const chat = await chatComponent({
    position: {
      x: CHAT_PADDING.x,
      y: windowBounds.height - CHAT_PADDING.y,
    },
    zIndex: 1_000,
  });
  $container.add(chat);
  await chat.setInputWidth(windowBounds.width - CHAT_PADDING.x * 2);

  global.events.on(TulipEvent.RESIZE, async (size: Size) => {
    await chat.setPositionY(size.height - 15);
    await chat.setInputWidth(size.width - 24);
  });

  let $room;
  let $bubbleChat;

  const removeOnLoadRoom = System.proxy.on<any>(
    Event.LOAD_ROOM,
    async ({ room }) => {
      $room = await roomComponent({ layout: room.layout });
      $container.add($room);

      $bubbleChat = await bubbleChatComponent({ room: $room });
      $container.add($bubbleChat);
    },
  );

  const removeOnLeaveRoom = System.proxy.on<any>(
    Event.LEAVE_ROOM,
    async ({ room }) => {
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
