import { container, ContainerComponent, sprite } from "@tu/tulip";
import { getPositionFromIsometricPosition } from "shared/utils";
import { User } from "shared/types";
import { Direction, SpriteSheetEnum } from "shared/enums";
import { System } from "system";

type Props = {
  user: User;
};

export const previewHumanComponent: ContainerComponent<Props> = (props) => {
  const HUMAN_TINT = 0xefcfb1;
  const $container = container<Props>({
    ...props,
  });

  const { user } = $container.getProps();

  const $direction: Direction = user.bodyDirection;

  const humanData = System.game.human.get($direction);

  const $body = container({
    pivot: humanData.pivot,
  });
  $body.setScaleX(humanData?.xScale ?? 1);
  $container.add($body);

  const head = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `head_${humanData.directionInitials}`,
    pivot: humanData.head.pivot,
    tint: HUMAN_TINT,
  });
  const torso = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `torso_${humanData.directionInitials}`,
    tint: HUMAN_TINT,
  });

  $body.add(torso, head);

  $container.setPosition(
    getPositionFromIsometricPosition({ x: 1, y: 0, z: 0 }),
  );

  {
    $body.setPivot(humanData.pivot);
    $body.setScaleX(humanData?.xScale ?? 1);

    head.setTexture(
      `head_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
    head.setPivot(humanData.head.pivot);

    torso.setTexture(
      `torso_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
  }

  return $container.getComponent(previewHumanComponent);
};
