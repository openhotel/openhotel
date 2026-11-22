import React from "react";
import { NavItem } from "shared/types/navigation.types.ts";
import { ButtonComponent } from "shared/components/button.component.tsx";

type Props = {
  items?: NavItem[];
  selectedItem?: string;
  onClickItem?: (item: NavItem) => void;
};

export const NavBarComponent: React.FC<Props> = ({
  items,
  selectedItem,
  onClickItem,
}) => {
  return (
    <>
      {items?.map((item) => (
        <ButtonComponent
          accent={item.key === selectedItem}
          disabled={item.disabled}
          onClick={() => onClickItem?.(item)}
        >
          {item.label}
        </ButtonComponent>
      ))}
    </>
  );
};
