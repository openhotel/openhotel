import { container, ContainerComponent } from "@tulib/tulip";
import { Event } from "../../shared/enums";
import { logComponent } from "../main/components/log.component";
import { bubbleChatComponent, chatComponent } from "../chat";
import { System } from "../../system";
import { roomComponent } from "../room";

export const gameScreenComponent: ContainerComponent = async () => {
  const $container = await container();

  const logs = await logComponent();
  await logs.setZIndex(1_000);
  $container.add(logs);

  const chat = await chatComponent();
  await chat.setPosition({ x: 100, y: 300 });
  await chat.setZIndex(1_000);
  $container.add(chat);

  let $room;
  let $bubbleChat;

  // System.proxy.on<any>(Event.TEST, async ({ username }) => {
  //   console.log("hello there!", username);
  // });

  System.proxy.on<any>(Event.LOAD_ROOM, async ({ room }) => {
    $room = await roomComponent({ layout: room.layout, addLog: logs.addLog });
    $container.add($room);

    $bubbleChat = await bubbleChatComponent({ room: $room });
    $container.add($bubbleChat);

    // setInterval(() => {
    //   System.proxy.emit(Event.TEST, {});
    // }, 2000);
  });

  return $container.getComponent(gameScreenComponent);
};
