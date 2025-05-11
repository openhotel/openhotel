import React from "react";
import { ModalInventoryCategoryProps } from "shared/types";
import { TextComponent } from "shared/components";

export const CategoryRaresComponent: React.FC<
  ModalInventoryCategoryProps
> = () => {
  return <TextComponent text="rares" tint={0} />;
};
