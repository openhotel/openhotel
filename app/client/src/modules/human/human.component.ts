import {
  ContainerComponent,
  container,
  graphics,
  GraphicType,
  sprite,
  textSprite,
} from "@tulib/tulip";
import { getIsometricPosition } from "shared/utils";
import { Point3d } from "shared/types";

type Props = {
  username: string;
};

type Mutable = {
  setIsometricPosition: (position: Point3d) => Promise<void>;
  getIsometricPosition: () => Point3d;
  getUsername: () => string;
};

export const humanComponent: ContainerComponent<Props, Mutable> = async ({
  username,
}) => {
  const $container = await container<Props, Mutable>();

  const capsule = await graphics({
    type: GraphicType.CAPSULE,
    radius: 50 / 2,
    length: 30,
    angle: 90,
    color: 0xff00ff,
    zIndex: -1000,
    alpha: 0.0001,
  });
  await capsule.setPivotX(-25);
  const tagName = await textSprite({
    text: username,
    spriteSheet: "default-font.json",
    position: {
      y: -16,
      x: 0,
    },
  });
  await tagName.setPivotX(tagName.getDisplayObject().getBounds().width / 2);
  $container.add(capsule, tagName);

  const human = await sprite({
    texture: "human_dev.png",
  });
  await human.setTint(0xefcfb1);

  $container.add(human);
  const bounds = human.getDisplayObject().getBounds();
  await human.setPivotX(Math.round(bounds.width / 2));

  await $container.setPivotY(bounds.height - 15);
  await $container.setPivotX(-23);

  let isometricPosition: Point3d;

  return $container.getComponent(humanComponent, {
    setIsometricPosition: async (position) => {
      isometricPosition = position;
      await $container.setPosition(getIsometricPosition(position, 12));
      await $container.setZIndex(
        isometricPosition.x + isometricPosition.z + 500,
      );
    },
    getIsometricPosition: () => isometricPosition,
    getUsername: () => username,
  });
};
