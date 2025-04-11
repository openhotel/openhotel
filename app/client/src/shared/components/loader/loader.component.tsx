import React, { PropsWithChildren } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";

type Props = {
  message: string;
} & PropsWithChildren;

export const LoaderComponent: React.FC<Props> = ({ message, children }) => {
  return message ? (
    <ContainerComponent>
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        <TextComponent text={message} />
      </FlexContainerComponent>
    </ContainerComponent>
  ) : (
    children
  );
};
