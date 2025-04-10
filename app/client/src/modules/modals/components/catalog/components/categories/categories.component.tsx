import React from "react";
import { ContainerComponent, ContainerProps } from "@oh/pixi-components";
import { ButtonComponent, TextComponent } from "shared/components";

type Props = {} & ContainerProps;

export const CategoriesComponent: React.FC<Props> = ({ ...containerProps }) => {
  return (
    <ContainerComponent {...containerProps}>
      <TextComponent text="123Abc" color={0xff00ff} />
    </ContainerComponent>
  );
};
