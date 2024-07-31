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
import { roomComponent, previewComponent } from "modules/room";
import { getRandomNumber } from "shared/utils";
import { Size } from "shared/types";

const CHAT_PADDING = {
  x: 12,
  y: 15,
};

const PREVIEW_PADDING = {
  x: 80,
  y: 180,
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

  const $preview = await previewComponent();
  await $preview.setPosition({
    x: windowBounds.width - PREVIEW_PADDING.x,
    y: windowBounds.height - PREVIEW_PADDING.y,
  });
  $container.add($preview);

  global.events.on(TulipEvent.RESIZE, async (size: Size) => {
    await chat.setPositionY(size.height - CHAT_PADDING.y);
    await chat.setInputWidth(size.width - CHAT_PADDING.x * 2);

    await $preview.setPosition({
      x: size.width - PREVIEW_PADDING.x,
      y: size.height - PREVIEW_PADDING.y,
    });
  });

  let $room;
  let $bubbleChat;

  const removeOnLoadRoom = System.proxy.on<any>(
    Event.LOAD_ROOM,
    async ({ room }) => {
      System.game.rooms.set(room);
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
