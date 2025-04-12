import React from "react";
import { ContainerComponent, ContainerProps } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";

type Props = {} & ContainerProps;

export const CategoriesComponent: React.FC<Props> = ({ ...containerProps }) => {
  return (
    <ContainerComponent {...containerProps}>
      <TextComponent text="123Abc" color={0xff00ff} />
    </ContainerComponent>
  );
};
