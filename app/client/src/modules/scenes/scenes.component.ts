import { container, ContainerComponent, ContainerMutable } from "@tu/tulip";
import { System } from "system";
import { Event } from "shared/enums";
import { homeComponent } from "./home";
import { offlineComponent } from "./offline";
import { privateRoomComponent } from "./private-room";
import { LoadRoomEvent } from "shared/types";
import { interfacesComponent } from "./interfaces";

export const scenesComponent: ContainerComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  let $interfaces = interfacesComponent();

  let $privateRoom: ContainerMutable | undefined;
  let $homeScene: ContainerMutable | undefined;

  System.proxy.on<LoadRoomEvent>(Event.LOAD_ROOM, ({ room }) => {
    System.game.rooms.set(room);

    $container.remove($homeScene);

    $privateRoom = $privateRoom ?? privateRoomComponent();
    $container.add($privateRoom);
  });

  const $offlineScene = offlineComponent();
  $homeScene = homeComponent();

  $container.add($interfaces, $offlineScene, $homeScene);

  System.proxy.on(Event.DISCONNECTED, () => {
    $offlineScene.setVisible(true);
  });

  System.proxy.on<any>(Event.LEAVE_ROOM, () => {
    System.game.rooms.remove();
    $container.remove($privateRoom);

    $container.add($homeScene);
  });

  return $container.getComponent(scenesComponent);
};
