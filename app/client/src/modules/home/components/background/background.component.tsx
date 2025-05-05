import React, { useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  Event,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
  SpriteComponent,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { TextureEnum } from "shared/enums";

export const BackgroundComponent: React.FC = () => {
  const { on } = useEvents();
  const { getSize } = useWindow();

  const [screenWidth, setScreenWidth] = useState<number>(getSize().width);

  useEffect(() => {
    return on<Size>(Event.RESIZE, (size) => setScreenWidth(size.width));
  }, [on, setScreenWidth]);

  return useMemo(
    () => (
      <ContainerComponent>
        <FlexContainerComponent
          align={FLEX_ALIGN.CENTER}
          justify={FLEX_JUSTIFY.CENTER}
        >
          <SpriteComponent texture={TextureEnum.HOTEL_ALPHA_V1} />
        </FlexContainerComponent>

        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={screenWidth}
          height={50}
          tint={0}
        />
        <FlexContainerComponent align={FLEX_ALIGN.BOTTOM}>
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={screenWidth}
            height={50}
            tint={0}
          />
        </FlexContainerComponent>
      </ContainerComponent>
    ),
    [screenWidth],
  );
};
