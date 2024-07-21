import { container, ContainerComponent, textSprite } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { homeComponent, sceneComponent } from "modules/pages";
import { getVersion, isDevelopment } from "shared/utils";

export const mainComponent: ContainerComponent = async () => {
  const $container = await container();

  const $logo = await logoComponent();
  await $logo.setPosition({ x: 8, y: 8 });

  let $version = await textSprite({
    text: isDevelopment() ? "DEVELOPMENT" : `${getVersion()}-alpha`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 45,
      y: 85,
    },
  });
  $container.add($logo, $version);

  const $homePage = await homeComponent();

  $container.add($homePage);

  const removeConnectedEvent = System.proxy.on(Event.WELCOME, async (data) => {
    $container.remove($homePage);

    const $scene = await sceneComponent();
    $container.add($scene);

    removeConnectedEvent();
  });

  return $container.getComponent(mainComponent);
};
