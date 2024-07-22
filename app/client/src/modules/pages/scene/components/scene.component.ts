import { container, ContainerComponent } from "@tulib/tulip";
import { System } from "system";
import { Event } from "shared/enums";
import { gameComponent } from "./game.component";

export const sceneComponent: ContainerComponent = async () => {
  const $container = await container();

  let $game = await gameComponent();
  $container.add($game);

  System.proxy.emit(Event.JOIN_ROOM, {
    // roomId: `test_${getRandomNumber(0, 2)}`,
    roomId: `test_1`,
  });

  return $container.getComponent(sceneComponent);
};
