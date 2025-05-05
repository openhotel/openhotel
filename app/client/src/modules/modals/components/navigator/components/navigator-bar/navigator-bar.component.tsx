import React, { useCallback, useMemo } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { NavigatorButtonComponent } from "../";
import { ModalNavigatorTab } from "shared/enums";
import { MODAL_NAVIGATOR_TAB_NAME_MAP } from "shared/consts";
import { useTranslation } from "react-i18next";

type Props = {
  selectedCategory?: ModalNavigatorTab;
  onSelectCategory?: (category: ModalNavigatorTab) => void;
};

const CATEGORIES = Object.keys(ModalNavigatorTab)
  .filter((num) => !isNaN(num as unknown as number))
  .map(Number) as unknown[] as ModalNavigatorTab[];

export const NavigatorBarComponent: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const $onSelectCategory = useCallback(
    (category: ModalNavigatorTab) => () => {
      onSelectCategory?.(category);
    },
    [onSelectCategory],
  );

  // const { update, lastUpdate } = useUpdate();
  //
  // const onLoaded = useCallback(() => {
  //   update();
  // }, [update]);

  console.log(t(MODAL_NAVIGATOR_TAB_NAME_MAP["0"]));

  const renderCategories = useMemo(
    () =>
      CATEGORIES.map((category: ModalNavigatorTab, index) => (
        <ContainerComponent
          key={category}
          onPointerDown={$onSelectCategory(category)}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          pivot={{
            x: index,
          }}
        >
          <NavigatorButtonComponent
            text={t(MODAL_NAVIGATOR_TAB_NAME_MAP[category])}
            selected={selectedCategory === category}
            type={
              index === 0
                ? "left"
                : index === CATEGORIES.length - 1
                  ? "right"
                  : "mid"
            }
          />
        </ContainerComponent>
      )),
    [selectedCategory, t, $onSelectCategory],
  );

  return useMemo(
    () => (
      <FlexContainerComponent justify={FLEX_JUSTIFY.START}>
        {renderCategories}
      </FlexContainerComponent>
    ),
    [renderCategories],
  );
};
