import React from "react";
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
  // const [selectedCategory, setSelectedCategory] = useState<number>(0);
  //
  // const onSelectedCategory = useCallback(
  //   (index) => () => setSelectedCategory(index),
  //   [setSelectedCategory],
  // );

  return (
    <ContainerComponent {...containerProps}>
      {categories.map((category, index) => (
        <CategoryOptionComponent
          key={category.id}
          type={
            index === 0
              ? "top"
              : index === categories.length - 1
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
      ))}
    </ContainerComponent>
  );
};
