import React, { useMemo } from "react";
import {
  AssetEnum,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
  SpriteSheetEnum,
} from "shared/enums";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { getCharacterBodyPart } from "shared/utils";
import { useAssets } from "shared/hooks";

type Props = {
  direction: CharacterDirection;
  action: CharacterBodyAction;
  children?: React.ReactNode;
  skinColor: number;
  scale: number;
};

export const BodyComponent: React.FC<Props> = ({
  action,
  direction,
  children,
  skinColor,
  scale,
}) => {
  const { getAsset } = useAssets();
  const texture = useMemo(
    () => getCharacterBodyPart(CharacterPart.BODY, direction, action),
    [action],
  );

  const data = useMemo(() => {
    return getAsset(AssetEnum.CHARACTER_DATA)["north"]["idle"]["body"].pivot;
  }, []);

  console.log(data);

  return (
    <ContainerComponent
      sortableChildren
      pivot={{
        x: 9,
        y: 44,
      }}
    >
      <SpriteComponent
        texture={texture}
        spriteSheet={SpriteSheetEnum.CHARACTER}
        tint={skinColor}
        scale={{
          x: scale,
        }}
      />
      {children}
    </ContainerComponent>
  );
};
