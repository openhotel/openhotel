import {
  container,
  ContainerComponent,
  ContainerMutable,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  sprite,
  textSprite,
} from "@tulib/tulip";
import { getIsometricPosition } from "shared/utils";
import { Point3d } from "shared/types";
import { Event, SpriteSheetEnum } from "shared/enums";
import { TILE_SIZE } from "shared/consts";
import { System } from "../../system";
import { typingBubbleComponent } from "../chat";

type Props = {
  user: any;
};

type Mutable = {
  setIsometricPosition: (position: Point3d) => Promise<void>;
  getIsometricPosition: () => Point3d;
  getUser: () => { id: string; username: string };
};

export type HumanMutable = ContainerMutable<{}, Mutable>;

export const humanComponent: ContainerComponent<Props, Mutable> = async ({
  user,
}) => {
  const $container = await container<Props, Mutable>();
  await $container.setEventMode(EventMode.NONE);

  const capsule = await graphics({
    type: GraphicType.CAPSULE,
    radius: TILE_SIZE.width / 2,
    length: 30,
    angle: 90,
    tint: 0xff00ff,
    zIndex: -1000,
    alpha: 0.0001,
  });
  await capsule.setPivotX(-TILE_SIZE.height);
  const tagName = await textSprite({
    text: user.username,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      y: -16,
      x: 0,
    },
  });
  await tagName.setPivotX(tagName.getBounds().width / 2);
  $container.add(capsule, tagName);

  const human = await sprite({
    texture: "human_dev.png",
  });
  await human.setTint(0xefcfb1);

  $container.add(human);
  const bounds = human.getBounds();
  await human.setPivotX(Math.round(bounds.width / 2));

  await $container.setPivotY(bounds.height - 15);
  await $container.setPivotX(-23);

  let isometricPosition: Point3d;

  const $typingBubble = await typingBubbleComponent();
  await $typingBubble.setPosition({
    x: 8,
    y: -8,
  });
  $container.add($typingBubble);

  let removeOnTypingStart: () => void;
  let removeOnTypingEnd: () => void;

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnTypingStart?.();
    removeOnTypingEnd?.();
  });
  $container.on(DisplayObjectEvent.ADDED, async () => {
    removeOnTypingStart = System.proxy.on<{ userId: string }>(
      Event.TYPING_START,
      ({ userId }) => {
        if (user.id === userId) $typingBubble.setVisible(true);
      },
    );

    removeOnTypingEnd = System.proxy.on<{ userId: string }>(
      Event.TYPING_END,
      ({ userId }) => {
        if (user.id === userId) $typingBubble.setVisible(false);
      },
    );
  });

  $container.add($typingBubble);

  return $container.getComponent(humanComponent, {
    setIsometricPosition: async (position) => {
      isometricPosition = position;
      await $container.setPosition(getIsometricPosition(position, 12));
      await $container.setZIndex(isometricPosition.x + isometricPosition.z);
    },
    getIsometricPosition: () => isometricPosition,
    getUser: () => user,
  });
};
