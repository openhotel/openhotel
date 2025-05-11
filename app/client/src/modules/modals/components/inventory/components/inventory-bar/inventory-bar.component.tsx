import React, { useCallback, useMemo } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { InventoryButtonComponent } from "../";
import { ModalInventoryTab } from "shared/enums";
import { MODAL_INVENTORY_TAB_NAME_MAP } from "shared/consts";
import { useTranslation } from "react-i18next";

type Props = {
  selectedCategory?: ModalInventoryTab;
  onSelectCategory?: (category: ModalInventoryTab) => void;
};

const CATEGORIES = Object.keys(ModalInventoryTab)
  .filter((num) => !isNaN(num as unknown as number))
  .map(Number) as unknown[] as ModalInventoryTab[];

export const InventoryBarComponent: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const $onSelectCategory = useCallback(
    (category: ModalInventoryTab) => () => {
      onSelectCategory?.(category);
    },
    [onSelectCategory],
  );

  const renderCategories = useMemo(
    () =>
      CATEGORIES.map((category: ModalInventoryTab, index) => (
        <ContainerComponent
          key={category}
          onPointerDown={$onSelectCategory(category)}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          pivot={{
            x: index,
          }}
        >
          <InventoryButtonComponent
            text={t(MODAL_INVENTORY_TAB_NAME_MAP[category])}
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
      <FlexContainerComponent justify={FLEX_JUSTIFY.START} test={true}>
        {renderCategories}
      </FlexContainerComponent>
    ),
    [renderCategories],
  );
};
