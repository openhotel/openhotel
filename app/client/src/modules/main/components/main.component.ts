import { container, ContainerComponent, textSprite } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { homeComponent, offlineComponent, sceneComponent } from "modules/pages";
import { getVersion, isDevelopment } from "shared/utils";

export const mainComponent: ContainerComponent = async () => {
  const $container = await container();

  const $pageContainer = await container();
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
  $container.add($logo, $version, $pageContainer);

  const $homePage = await homeComponent();
  $pageContainer.add($homePage);

  const $destroyChildContainer = () => {
    $pageContainer.remove(...$pageContainer.getChildren());
  };

  System.proxy.on(Event.WELCOME, async (data) => {
    $destroyChildContainer();

    const $scene = await sceneComponent();
    $pageContainer.add($scene);
  });

  const connect = async () => {
    await System.proxy.connect();
  };

  System.proxy.on(Event.DISCONNECTED, async () => {
    const $offlinePage = await offlineComponent({
      reconnect: connect,
    });
    $pageContainer.add($offlinePage);
  });

  return $container.getComponent(mainComponent);
};
