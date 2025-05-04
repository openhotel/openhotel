import React, { useCallback, useMemo } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  useUpdate,
} from "@openhotel/pixi-components";
import { NavigatorButtonComponent } from "../";
import { ModalNavigatorTab } from "shared/enums";
import { MODAL_NAVIGATOR_TAB_NAME_MAP } from "shared/consts";

import { useTranslation } from "react-i18next";
type Props = {
  selectedCategory?: ModalNavigatorTab;
  onSelectCategory?: (category: ModalNavigatorTab) => void;
};

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

  const categories = useMemo(
    () =>
      Object.keys(ModalNavigatorTab)
        .filter((num) => !isNaN(num as unknown as number))
        .map(Number) as unknown[] as ModalNavigatorTab[],
    [],
  );

  // const { update, lastUpdate } = useUpdate();
  //
  // const onLoaded = useCallback(() => {
  //   update();
  // }, [update]);

  const renderCategories = useMemo(
    () => (
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.START}
        // onChildLoaded={onLoaded}
      >
        {categories.map((category: ModalNavigatorTab, index) => (
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
                  : index === categories.length - 1
                    ? "right"
                    : "mid"
              }
            />
          </ContainerComponent>
        ))}
      </FlexContainerComponent>
    ),
    [categories, selectedCategory, t, $onSelectCategory, lastUpdate],
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
