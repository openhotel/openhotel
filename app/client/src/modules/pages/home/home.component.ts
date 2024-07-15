import { container, ContainerComponent } from "@tulib/tulip";
import { inputComponent } from "shared/components";

export const homeComponent: ContainerComponent = async () => {
  const $container = await container({
    position: {
      x: 150,
      y: 50,
    },
  });

  const $input = await inputComponent();
  $container.add($input);

  return $container.getComponent(homeComponent);
};
