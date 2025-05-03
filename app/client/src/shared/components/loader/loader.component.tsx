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
  if (message)
    return useMemo(
      () => (
        <ContainerComponent>
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            align={FLEX_ALIGN.CENTER}
          >
            <TextComponent text={message} />
          </FlexContainerComponent>
        </ContainerComponent>
      ),
      [message],
    );

  return useMemo(() => children, [children]);
};
