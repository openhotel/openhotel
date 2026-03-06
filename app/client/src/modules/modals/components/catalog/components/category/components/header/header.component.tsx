import React, { useMemo } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@openhotel/pixi-components";
import { NoteComponent, TextComponent } from "shared/components";

type Props = {
  size: Size;
  description: string;
};

export const HeaderComponent: React.FC<Props> = ({ size, description }) => {
  const coverHeight = useMemo(
    () =>
      size.height -
      //text two lines
      15 -
      //padding
      5,
    [size],
  );

  return useMemo(
    () => (
      <ContainerComponent>
        <NoteComponent
          type="TODO"
          issue={1127}
          title="Individual category banner"
          description="Needs art!"
        >
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={size.width}
            height={coverHeight}
            tint={0}
            alpha={0.2}
          />
        </NoteComponent>
        <TextComponent
          text={description}
          maxWidth={size.width}
          color={0}
          position={{
            y: coverHeight + 5,
          }}
        />
      </ContainerComponent>
    ),
    [size, coverHeight, description],
  );
};
