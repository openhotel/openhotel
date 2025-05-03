import React, { useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
} from "@openhotel/pixi-components";
import { CategoryOptionComponent } from "../";
import { CatalogCategory } from "shared/types";

type Props = {
  width: number;
  categories: CatalogCategory[];

  selectedCategoryId: string;
  onSelectedCategory: (categoryId: string) => void;
} & ContainerProps;

export const CategoriesComponent: React.FC<Props> = ({
  width,
  categories,
  selectedCategoryId,
  onSelectedCategory,
  ...containerProps
}) => {
  const allCategories = useMemo(
    () => [
      {
        id: "home",
        label: "Front P.",
      },
      ...categories,
    ],
    [categories],
  );

  const renderCategories = useMemo(
    () =>
      allCategories.map((category, index) => (
        <CategoryOptionComponent
          key={category.id}
          type={
            index === 0
              ? "top"
              : index === allCategories.length - 1
                ? "bottom"
                : "middle"
          }
          text={category.label}
          selected={selectedCategoryId === category.id}
          width={width}
          position={{
            y: 13 * index,
          }}
          onPointerDown={() => onSelectedCategory(category.id)}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
        />
      )),
    [allCategories, width],
  );

  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        {renderCategories}
      </ContainerComponent>
    ),
    [renderCategories, containerProps],
  );
};
