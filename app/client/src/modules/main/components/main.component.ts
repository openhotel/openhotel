import { container, textSprite } from "@tu/tulip";
import { logoComponent } from "./logo.component";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { homeComponent, offlineComponent, sceneComponent } from "modules/pages";
import { getVersion, isDevelopment } from "shared/utils";

export const mainComponent = () => {
  const $container = container();

  const $pageContainer = container();
  const $logo = logoComponent();
  $logo.setPosition({ x: 8, y: 8 });

  let $version = textSprite({
    text: isDevelopment() ? "DEVELOPMENT" : `${getVersion()}-alpha`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 45,
      y: 85,
    },
  });
  $container.add($logo, $version, $pageContainer);

  const $homePage = homeComponent();
  $pageContainer.add($homePage);

  let $scene;
  let $offlinePage;

  System.proxy.on<any>(Event.WELCOME, async ({ user }) => {
    System.game.users.setCurrentUser(user);

    $homePage && $homePage.$destroy();
    $offlinePage && $offlinePage.$destroy();
    $scene && $scene.$destroy();

    $scene = sceneComponent();
    $pageContainer.add($scene);
  });

  const reconnect = () => System.proxy.refreshSession();

  System.proxy.on(Event.DISCONNECTED, () => {
    $offlinePage = offlineComponent({
      reconnect,
    });
    $pageContainer.add($offlinePage);
  });

  try {
    reconnect();
  } catch (e) {
    console.warn("Cannot refresh session, you need to log in!");
  }
  return $container.getComponent(mainComponent);
};
