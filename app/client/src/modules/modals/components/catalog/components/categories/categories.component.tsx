import React, { useCallback, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
} from "@openhotel/pixi-components";
import { CategoryOptionComponent } from "../";

type Props = {
  width: number;
  categories: string[];
} & ContainerProps;

export const CategoriesComponent: React.FC<Props> = ({
  width,
  categories,
  ...containerProps
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const onSelectedCategory = useCallback(
    (index) => () => setSelectedCategory(index),
    [setSelectedCategory],
  );

  return (
    <ContainerComponent {...containerProps}>
      {categories.map((category, index) => (
        <CategoryOptionComponent
          key={index}
          type={
            index === 0
              ? "top"
              : index === categories.length - 1
                ? "bottom"
                : "middle"
          }
          text={category}
          selected={selectedCategory === index}
          width={width}
          position={{
            y: 13 * index,
          }}
          onPointerDown={onSelectedCategory(index)}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
        />
      ))}
    </ContainerComponent>
  );
};
