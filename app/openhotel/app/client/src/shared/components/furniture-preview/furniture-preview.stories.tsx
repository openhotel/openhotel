import { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import { FurniturePreviewComponent } from "./furniture-preview.component";
import { FurnitureData } from "shared/types";
import { GraphicsComponent, GraphicType } from "@openhotel/pixi-components";
import { useFurniture } from "shared/hooks";

export default {
  title: "Shared/Furniture Preview",
  component: FurniturePreviewComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurniturePreviewComponent>;

type Story = StoryObj<typeof FurniturePreviewComponent>;

const LoadComponent = () => {
  const { load, get } = useFurniture();
  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  useEffect(() => {
    // const name = "./toys@octopus-0";
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
      <FurniturePreviewComponent furnitureData={furnitureData} size={size} />
    </>
  );
};

//@ts-ignore
export const Load: Story = () => <LoadComponent />;
