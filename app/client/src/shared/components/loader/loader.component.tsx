import React, { PropsWithChildren, useMemo } from "react";
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
  return useMemo(
    () =>
      message ? (
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
      ),
    [message, children],
  );
};
