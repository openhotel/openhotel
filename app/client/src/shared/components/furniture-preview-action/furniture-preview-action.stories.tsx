import { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";
import { FurniturePreviewActionComponent } from "./furniture-preview-action.component";
import { FurnitureData } from "shared/types";
import { GraphicsComponent, GraphicType } from "@openhotel/pixi-components";
import { ButtonComponent } from "shared/components";
import { useFurniture } from "shared/hooks";

export default {
  title: "Shared/Furniture Preview Action",
  component: FurniturePreviewActionComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurniturePreviewActionComponent>;

type Story = StoryObj<typeof FurniturePreviewActionComponent>;

const LoadComponent = () => {
  const { load, get } = useFurniture();
  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  useEffect(() => {
    const name = "teleports@telephone";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  if (!furnitureData) return null;

  const size = {
    width: 200,
    height: 200,
  };

  return (
    <>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={size.height}
        tint={0xff00ff}
      />
      <FurniturePreviewActionComponent furniture={furnitureData} size={size}>
        <ButtonComponent
          text={"test"}
          autoWidth
          size={{ height: 16 }}
          position={{ x: 2, y: 2 }}
        />
      </FurniturePreviewActionComponent>
    </>
  );
};

//@ts-ignore
export const Load: Story = () => <LoadComponent />;
