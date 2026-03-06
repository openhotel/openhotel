import React from "react";
import { NoteComponent, TextComponent } from "shared/components";

export const CategoryHotelComponent: React.FC = () => {
  return (
    <NoteComponent
      type="TODO"
      issue={1124}
      title="Public rooms"
      description="Create core arch to allow public rooms!"
    >
      <TextComponent text="Hotel" tint={0} />
    </NoteComponent>
  );
};
