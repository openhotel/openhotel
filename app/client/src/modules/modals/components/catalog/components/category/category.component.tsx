import React from "react";
import { CatalogCategory, Size2d } from "shared/types";
import { ContainerComponent, ContainerProps } from "@openhotel/pixi-components";
import { DefaultCategoryComponent, HeaderComponent } from "./components";

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
  return (
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
  );
};
