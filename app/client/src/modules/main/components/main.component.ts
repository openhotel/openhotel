import { container, ContainerComponent } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { logComponent } from "./log.component";
import { System } from "system";
import { roomComponent } from "modules/room";
import { humanComponent } from "modules/human";

export const mainComponent: ContainerComponent = async () => {
  await System.preConnect();
  const $container = await container();

  const $logo = await logoComponent();
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  const $log = await logComponent();

  $container.add($log);

  const room = await roomComponent();

  let humanList = [];
  const socket = System.getSocket();
  socket.on("add-human", async ({ username }) => {
    console.log(username);
    const human = await humanComponent({ username: username });
    const pos = room.getFreeTilePosition();
    await human.setIsometricPosition(pos);
    humanList.push(human);
    room.add(human);
  });
  socket.on("remove-human", ({ username }) => {
    const currentHuman = humanList.find(
      (human) => human.getUsername() === username,
    );
    room.releaseTilePosition(currentHuman.getIsometricPosition());
    room.remove(currentHuman);
    humanList = humanList.filter((human) => human.getUsername() !== username);
  });

  $container.add(room);

  await System.connect();
  return $container.getComponent(mainComponent);
};
