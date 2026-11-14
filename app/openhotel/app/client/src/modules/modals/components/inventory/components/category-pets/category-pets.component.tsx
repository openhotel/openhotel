import React from "react";
import { ModalInventoryCategoryProps } from "shared/types";
import { NoteComponent, TextComponent } from "shared/components";

export const CategoryPetsComponent: React.FC<
  ModalInventoryCategoryProps
> = () => {
  return (
    <NoteComponent
      type="TODO"
      issue={1130}
      title="Pets core and how to store it"
      description="Needs thinking!"
    >
      <TextComponent text="pets" tint={0} />
    </NoteComponent>
  );
};
