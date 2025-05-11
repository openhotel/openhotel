import React, { useMemo } from "react";
import { FurnitureItemComponent, ItemListComponent } from "shared/components";
import { InventoryFurniture, Size2d } from "shared/types";

type Props = {
  size: Size2d;
  furniture: InventoryFurniture[];
};

export const InventoryContentComponent: React.FC<Props> = ({
  size,
  furniture,
}) => {
  const items = useMemo(
    () =>
      furniture?.map(($furniture) => {
        return {
          key: $furniture.furnitureId,
          render: () => (
            <FurnitureItemComponent
              furnitureId={$furniture.furnitureId}
              type={$furniture.type}
              amount={$furniture.ids.length}
            />
          ),
        };
      }),
    [furniture],
  );

  return (
    <>
      <ItemListComponent
        rows={10}
        cols={6}
        height={size.height}
        items={items}
        onSelect={null}
      />
      {/*<ContainerComponent>*/}
      {/*  <TextComponent text={"test"} />*/}
      {/*</ContainerComponent>*/}
    </>
  );
};
