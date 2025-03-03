import React from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { TextComponent } from "shared/components";
import { useLoader } from "shared/hooks";

export const LoaderComponent: React.FC = () => {
  const { currentText } = useLoader();

  return (
    <ContainerComponent>
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        <TextComponent text={currentText} />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
