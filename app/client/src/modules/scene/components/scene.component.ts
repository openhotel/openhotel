import { container, ContainerComponent } from "@tulib/tulip";
import { logComponent } from "modules/main/components/log.component";
import { System } from "system";
import { Event } from "shared/enums";
import { roomComponent } from "modules/room";
import { bubbleChatComponent, chatComponent } from "modules/chat";

export const sceneComponent: ContainerComponent = async () => {
  const $container = await container();

  const logs = await logComponent();
  await logs.setZIndex(1_000);
  $container.add(logs);

  const chat = await chatComponent();
  await chat.setPosition({ x: 100, y: 300 });
  await chat.setZIndex(1_000);
  $container.add(chat);

  let $room;

  System.proxy.on<any>(Event.TEST, async ({ username }) => {
    console.log("hello there!", username);
  });

  await System.proxy.connect();

  System.proxy.on<any>(Event.LOAD_ROOM, async ({ room }) => {
    $room = await roomComponent({ layout: room.layout, addLog: logs.addLog });
    $container.add($room);

    const bubbleChat = await bubbleChatComponent({ room: $room });
    $container.add(bubbleChat);

    // setInterval(() => {
    //   System.proxy.emit(Event.TEST, {});
    // }, 2000);
  });

  System.proxy.emit(Event.JOIN_ROOM, {
    roomId: `test_2`,
  });

  return $container.getComponent(sceneComponent);
};
