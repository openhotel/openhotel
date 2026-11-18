import React, { useMemo } from "react";
import { CatalogCategory } from "shared/types";
import { ContainerComponent, ContainerProps } from "@openhotel/pixi-components";
import { DefaultCategoryComponent, HeaderComponent } from "./components";
import { Size2d } from "@shared/types/size.types.ts";

type Props = {
  size: Size2d;
  categoryId: string;
  category: CatalogCategory;
} & ContainerProps;

export const HEADER_SIZE = 74;

export const CategoryComponent: React.FC<Props> = ({
  size,
  categoryId,
  category,
  ...containerProps
}) => {
  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        <HeaderComponent
          size={{
            width: size.width,
            height: HEADER_SIZE,
          }}
          description={category.description}
        />
        <DefaultCategoryComponent
          position={{
            y: HEADER_SIZE + 5,
          }}
          categoryId={categoryId}
          size={{
            width: size.width,
            height: size.height - HEADER_SIZE - 5,
          }}
        />
      </ContainerComponent>
    ),
    [containerProps, size, category, categoryId],
  );
};
