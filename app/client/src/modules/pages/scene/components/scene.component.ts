import { container, ContainerComponent, textSprite } from "@tulib/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { getVersion, isDevelopment } from "shared/utils";
import { gameComponent } from "./game.component";
import { offlineScreenComponent } from "./offline.component";

export const sceneComponent: ContainerComponent = async () => {
  const $container = await container();

  const connect = async () => {
    System.proxy.emit(Event.JOIN_ROOM, {
      // roomId: `test_${getRandomNumber(0, 2)}`,
      roomId: `test_1`,
    });

    await $game.setVisible(true);
    await $offline.setVisible(false);
  };

  const reconnect = async () => {
    await System.proxy.connect();
    await connect();
  };

  let $game = await gameComponent();
  let $offline = await offlineScreenComponent({
    visible: false,
    reconnect,
  });
  $container.add($game, $offline);

  let $version = await textSprite({
    text: isDevelopment() ? "DEVELOPMENT" : `${getVersion()}-alpha`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 45,
      y: 85,
    },
  });
  $container.add($version);

  System.proxy.on(Event.DISCONNECTED, async () => {
    console.log("DISCONNECTED");
    await $game.setVisible(false);
    await $offline.setVisible(true);
  });

  await connect();

  return $container.getComponent(sceneComponent);
};
