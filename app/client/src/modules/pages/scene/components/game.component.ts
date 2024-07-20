import { container, ContainerComponent } from "@tulib/tulip";
import { bubbleChatComponent, chatComponent } from "modules/chat";
import { Event } from "shared/enums";
import { System } from "system";
import { roomComponent } from "modules/room";
import { getRandomNumber } from "shared/utils";

export const gameComponent: ContainerComponent = async () => {
  const $container = await container();

  const chat = await chatComponent();
  await chat.setPosition({ x: 100, y: 280 });
  await chat.setZIndex(1_000);
  $container.add(chat);

  let $room;
  let $bubbleChat;

  System.proxy.on<any>(Event.LOAD_ROOM, async ({ room }) => {
    $room = await roomComponent({ layout: room.layout });
    $container.add($room);

    $bubbleChat = await bubbleChatComponent({ room: $room });
    $container.add($bubbleChat);
  });

  System.proxy.on<any>(Event.LEAVE_ROOM, async ({ room }) => {
    $container.remove($room, $bubbleChat);
    $room.$destroy();
    $bubbleChat.$destroy();

    System.proxy.emit(Event.JOIN_ROOM, {
      roomId: `test_${getRandomNumber(0, 2)}`,
      // roomId: `test_1`,
    });
  });

  return $container.getComponent(gameComponent);
};
