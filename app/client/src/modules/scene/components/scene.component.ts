import { container, ContainerComponent, textSprite } from "@tulib/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { gameScreenComponent } from "modules/scene";
import { getVersion } from "shared/utils";

export const sceneComponent: ContainerComponent = async () => {
  const $container = await container();

  let $screen = await gameScreenComponent();
  $container.add($screen);

  let $version = await textSprite({
    text: `${getVersion()}-alpha`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 45,
      y: 85,
    },
  });
  $container.add($version);

  // const changeScreen = (screen) => {
  //   $container.remove($screen);
  //   $screen = screen;
  //   $container.add($screen);
  // };

  // const reconnect = async () => {
  //   await System.proxy.connect();
  //   System.proxy.on(Event.DISCONNECTED, onDisconnected);
  //
  //   changeScreen(await gameScreenComponent());
  //
  //   System.proxy.emit(Event.JOIN_ROOM, {
  //     roomId: `test_2`,
  //   });
  // };

  console.log("JOIN");
  System.proxy.emit(Event.JOIN_ROOM, {
    // roomId: `test_${getRandomNumber(0, 2)}`,
    roomId: `test_1`,
  });

  return $container.getComponent(sceneComponent);
};
