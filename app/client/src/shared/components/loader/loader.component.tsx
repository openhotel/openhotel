import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { TextComponent } from "shared/components";
import { LoaderItem } from "shared/types";

type Props = {
  loaderItems?: LoaderItem[];
  message?: string;
} & PropsWithChildren;

export const LoaderComponent: React.FC<Props> = ({
  loaderItems,
  message,
  children,
}) => {
  const [currentText, setCurrentText] = useState<string>("Loading...");

  useEffect(() => {
    if (!loaderItems) return;
    (async () => {
      for (const {
        items,
        func,
        startLabel,
        endLabel,
        prefix,
        suffix,
      } of loaderItems) {
        setCurrentText(startLabel);
        for (const item of items) {
          setCurrentText(`${prefix} ${item.split(".")[0]} ${suffix}`);
          await func(item);
        }
        setCurrentText(endLabel);
      }
      setCurrentText(null);
    })();
  }, [loaderItems, setCurrentText]);

  return message ? (
    <ContainerComponent>
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        <TextComponent text={message ?? currentText} />
      </FlexContainerComponent>
    </ContainerComponent>
  ) : (
    children
  );
};
