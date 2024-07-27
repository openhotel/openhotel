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

  let $scene;
  let $offlinePage;

  System.proxy.on(Event.WELCOME, async () => {
    $homePage && $homePage.$destroy();
    $offlinePage && $offlinePage.$destroy();
    $scene && $scene.$destroy();

    $scene = await sceneComponent();
    $pageContainer.add($scene);
  });

  const reconnect = () => System.proxy.refreshSession();

  System.proxy.on(Event.DISCONNECTED, async () => {
    $offlinePage = await offlineComponent({
      reconnect,
    });
    $pageContainer.add($offlinePage);
  });

  try {
    await reconnect();
  } catch (e) {
    console.warn("Cannot refresh session, you need to log in!");
  }
  return $container.getComponent(mainComponent);
};
