import { container, ContainerComponent } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { System } from "system";
import { sceneComponent } from "modules/scene";

export const mainComponent: ContainerComponent = async () => {
  await System.proxy.preConnect();
  const $container = await container();

  const $logo = await logoComponent();
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  const $scene = await sceneComponent();
  $container.add($scene);

  return $container.getComponent(mainComponent);
};
