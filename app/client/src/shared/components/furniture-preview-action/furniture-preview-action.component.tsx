import React, { useMemo } from "react";
import { ContainerComponent } from "@openhotel/pixi-components";
import { FurniturePreviewComponent } from "shared/components/furniture-preview";
import { TextComponent } from "shared/components/text";
import { SoftBadgeComponent } from "shared/components/soft-badge";
import { FurnitureData, Size2d } from "shared/types";

type Props = {
  furniture: FurnitureData;
  size: Size2d;
  children?: React.ReactNode;
};

const SOFT_BADGE_HEIGHT = 20;

export const FurniturePreviewActionComponent: React.FC<Props> = ({
  furniture,
  size,
  children,
}) => {
  return useMemo(() => {
    const height = size.height - SOFT_BADGE_HEIGHT;
    return (
      <>
        <ContainerComponent position={{ x: 5 }}>
          <FurniturePreviewComponent
            furnitureData={furniture}
            size={{
              width: size.width - 10,
              height: height - 3 - 9 * 3 - 3,
            }}
          />
          <TextComponent
            position={{
              y: height - 9 * 3 - 3,
            }}
            bold
            color={0}
            text={furniture.label ?? furniture.furnitureId}
          />
          <TextComponent
            position={{
              y: height - 8 * 2 - 3,
            }}
            color={0}
            maxWidth={size.width - 10}
            text={
              furniture.description ?? "This is a test for a description an"
            }
          />
        </ContainerComponent>
        <ContainerComponent position={{ y: height }}>
          <SoftBadgeComponent
            size={{
              width: size.width,
              height: SOFT_BADGE_HEIGHT,
            }}
          />
          {children}
        </ContainerComponent>
      </>
    );
  }, [furniture, children, size]);
};
