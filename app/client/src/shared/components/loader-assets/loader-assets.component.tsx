import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { LoadingBarComponent, TextComponent } from "shared/components";
import { LoaderItem } from "shared/types";

type Props = {
  loaderItems: LoaderItem[];
  onDone?: () => void;
} & PropsWithChildren;

export const LoaderAssetsComponent: React.FC<Props> = ({
  loaderItems,
  onDone,
  children,
}) => {
  const currentPercentageRef = useRef<number>(0);
  const [currentText, setCurrentText] = useState<string>("Loading...");

  useEffect(() => {
    if (!loaderItems) return;
    (async () => {
      const totalItems = loaderItems.reduce(
        (total, { items }) => total + items.length,
        0,
      );
      let currentItem = 0;
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
          currentItem++;
          currentPercentageRef.current = currentItem / totalItems;
        }
        setCurrentText(endLabel);
      }
      setCurrentText(null);
      onDone?.();
    })();
  }, [loaderItems, setCurrentText, onDone]);

  return currentText ? (
    <ContainerComponent>
      <FlexContainerComponent
        align={FLEX_ALIGN.CENTER}
        justify={FLEX_JUSTIFY.CENTER}
        direction="y"
      >
        <TextComponent text={currentText} pivot={{ y: 4 }} />
        <LoadingBarComponent
          width={200}
          height={10}
          percentage={currentPercentageRef.current}
        />
      </FlexContainerComponent>
    </ContainerComponent>
  ) : (
    children
  );
};
