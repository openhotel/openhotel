import { container, ContainerComponent, textSprite } from "@tulib/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { getVersion, isDevelopment } from "../../../shared/utils";
import { gameScreenComponent, offlineScreenComponent } from "../../screens";

export const sceneComponent: ContainerComponent = async () => {
  const $container = await container();

  let $screen = await gameScreenComponent();
  $container.add($screen);

  if (!isDevelopment()) {
    let $version = await textSprite({
      text: `v${getVersion()}-alpha`,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 500,
        y: 10,
      },
    });
    $container.add($version);
  }

  await System.proxy.connect();

  const changeScreen = (screen) => {
    $container.remove($screen);
    $screen = screen;
    $container.add($screen);
  };

  const reconnect = async () => {
    await System.proxy.preConnect();
    await System.proxy.connect();
    System.proxy.on(Event.DISCONNECTED, onDisconnected);

    changeScreen(await gameScreenComponent());

    System.proxy.emit(Event.JOIN_ROOM, {
      roomId: `test_2`,
    });
  };

  const onDisconnected = async () => {
    changeScreen(await offlineScreenComponent({ reconnect }));
  };

  System.proxy.on(Event.DISCONNECTED, onDisconnected);

  System.proxy.emit(Event.JOIN_ROOM, {
    roomId: `test_2`,
  });

  return $container.getComponent(sceneComponent);
};
