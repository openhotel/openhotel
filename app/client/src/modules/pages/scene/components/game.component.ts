import { container, ContainerComponent } from "@tulib/tulip";
import { logComponent } from "modules/main";
import { bubbleChatComponent, chatComponent } from "modules/chat";
import { Event } from "shared/enums";
import { System } from "system";
import { roomComponent } from "modules/room";

export const gameComponent: ContainerComponent = async () => {
  const $container = await container();

  const logs = await logComponent();
  await logs.setZIndex(1_000);
  $container.add(logs);

  const chat = await chatComponent();
  await chat.setPosition({ x: 100, y: 280 });
  await chat.setZIndex(1_000);
  $container.add(chat);

  let $room;
  let $bubbleChat;

  System.proxy.on<any>(Event.LOAD_ROOM, async ({ room }) => {
    $room = await roomComponent({ layout: room.layout, addLog: logs.addLog });
    $container.add($room);

    $bubbleChat = await bubbleChatComponent({ room: $room });
    $container.add($bubbleChat);
  });

  return $container.getComponent(gameComponent);
};
