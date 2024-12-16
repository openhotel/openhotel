import { container } from "@tu/tulip";
import { System } from "system";
import { Event } from "shared/enums";
import { scenesComponent } from "modules/scenes";
import { infoComponent } from "modules/interfaces";
import { vignetteTransitionComponent } from "./vignette-transition.component";

export const mainComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  const $pageContainer = container();
  const $infoContainer = infoComponent();

  $container.add($pageContainer, $infoContainer);

  let $scene;

  $container.add(vignetteTransitionComponent());

  System.proxy.on<any>(Event.WELCOME, async ({ user }) => {
    System.game.users.setCurrentUser(user);

    $scene && $scene.$destroy();

    $scene = scenesComponent();
    $pageContainer.add($scene);
  });
  System.proxy.loaded();

  System.proxy.on(Event.REDIRECT, ({ redirectUrl }) =>
    window.location.replace(redirectUrl),
  );

  return $container.getComponent(mainComponent);
};
