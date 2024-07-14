import { container, ContainerComponent } from "@tulib/tulip";
import { logComponent } from "modules/main/components/log.component";
import { chatComponent } from "modules/main/components/chat.component";
import { System } from "system";
import { Event } from "shared/enums";
import { roomComponent } from "modules/room";
import { messageComponent } from "modules/main/components/message.component";

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

    setInterval(() => {
      System.proxy.emit(Event.TEST, {});
    }, 2000);
  });

  System.proxy.emit(Event.JOIN_ROOM, {
    roomId: `test_2`,
  });

  System.proxy.on<any>(Event.MESSAGE, async ({ userId, message: text }) => {
    const human = $room
      .getHumanList()
      .find((human) => human.getUser().id === userId);
    const { x: parentX, y: parentY } = human.getFather().getPosition();
    const { x, y } = human.getPosition();

    const message = await messageComponent({
      username: human.getUser().username,
      message: text,
    });
    await message.setPosition({ x: parentX + x, y: parentY + y - 80 });
    $container.add(message);
  });

  return $container.getComponent(sceneComponent);
};
