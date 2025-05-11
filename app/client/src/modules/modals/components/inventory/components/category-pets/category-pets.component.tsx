import React from "react";
import { ModalInventoryCategoryProps } from "shared/types";
import { TextComponent } from "shared/components";

export const CategoryPetsComponent: React.FC<
  ModalInventoryCategoryProps
> = () => {
  return <TextComponent text="pets" tint={0} />;
};
