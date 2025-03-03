import { container, ContainerComponent, ContainerMutable } from "@tu/tulip";
import { System } from "system";
import { Event } from "shared/enums";
import { homeComponent } from "./home";
import { offlineComponent } from "./offline";
import { privateRoomComponent } from "./private-room";
import { LoadRoomEvent } from "shared/types";
import { interfacesComponent } from "./interfaces";
import { wait } from "shared/utils";
import { vignetteTransitionComponent } from "modules/main";
import { ComponentMutable } from "@tu/tulip/_dist";

export const scenesComponent: ContainerComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  let $interfaces = interfacesComponent();

  let $privateRoom: ContainerMutable | undefined;
  let $homeScene: ContainerMutable | undefined;

  System.proxy.on<LoadRoomEvent>(Event.PRE_JOIN_ROOM, async ({ room }) => {
    await System.game.rooms.preload(room);

    System.proxy.emit(Event.JOIN_ROOM, { roomId: room.id });
  });

  System.proxy.on<LoadRoomEvent>(Event.LOAD_ROOM, async ({ room }) => {
    await System.game.rooms.load(room);

    console.log(room);

    switch (room.type) {
      case "private":
        $container.remove($homeScene);
        $homeScene.$destroy();

        $privateRoom = $privateRoom ?? privateRoomComponent();
        $container.add($privateRoom);
        System.displayObjects.setComponent(
          "private-room",
          $privateRoom as ComponentMutable,
        );

        System.loader.end();
        await wait(1250);
        $interfaces.setVisible(true);
        break;
    }
  });

  const $offlineScene = offlineComponent();
  $homeScene = homeComponent();
  $container.add(vignetteTransitionComponent());

  $container.add($interfaces, $offlineScene, $homeScene);

  System.proxy.on(Event.DISCONNECTED, () => {
    $offlineScene.setVisible(true);
  });

  System.proxy.on<any>(Event.LEAVE_ROOM, async ({ moveToAnotherRoom }) => {
    const currentRoom = System.game.rooms.get();
    System.game.rooms.remove();

    switch (currentRoom.type) {
      case "private":
        System.displayObjects.deleteComponent("private-room");
        $container.remove($privateRoom);

        if (!moveToAnotherRoom) {
          $homeScene = homeComponent();
          $container.add($homeScene);
          $container.add(vignetteTransitionComponent());
        }
        break;
    }
  });

  return $container.getComponent(scenesComponent);
};
