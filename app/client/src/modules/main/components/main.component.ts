import { container, ContainerComponent } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { System } from "system";
import { Event } from "shared/enums";
import { homeComponent, sceneComponent } from "modules/pages";

export const mainComponent: ContainerComponent = async () => {
  const $container = await container();

  const $logo = await logoComponent();
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

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
