import React, { useCallback, useEffect, useState } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { NavigatorButtonComponent } from "../";

type Props = {
  categories?: string[];
  onSelectCategory?: (category: string) => void;
};

export const NavigatorBarComponent: React.FC<Props> = ({
  categories = [],
  onSelectCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );

  useEffect(() => {
    setSelectedCategory(categories[0]);
  }, [setSelectedCategory, categories]);

  const $onSelectCategory = useCallback(
    (category: string) => () => {
      setSelectedCategory(category);
      onSelectCategory?.(category);
    },
    [setSelectedCategory, onSelectCategory],
  );

  return (
    <FlexContainerComponent justify={FLEX_JUSTIFY.START}>
      {categories.map((category, index) => (
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
            text={category}
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
  );
};
