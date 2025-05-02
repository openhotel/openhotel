import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { LoadingBarComponent, TextComponent } from "shared/components";
import { LoaderItem } from "shared/types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [currentText, setCurrentText] = useState<string>(
    `${t("system.loading")}...	`,
  );
  useEffect(() => {
    if (!loaderItems) return;
    (async () => {
      const totalItems = loaderItems.reduce(
        (total, { items }) => total + items.length,
        0,
      );
      let currentItem = 0;
      for (const { items, func, label } of loaderItems) {
        setCurrentText(`${t("system.loading")} ${label}`);
        for (const item of items) {
          setCurrentText(`${t("system.loading")} ${item.split(".")[0]}`);
          await func(item);
          currentItem++;
          currentPercentageRef.current = currentItem / totalItems;
        }
        setCurrentText(`${t("system.loading")} ${label}`);
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
