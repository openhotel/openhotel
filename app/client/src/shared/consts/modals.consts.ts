import { Modal, ModalNavigatorTab } from "shared/enums";
import {
  CatalogComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
} from "modules/modals";
import React from "react";
import { Size } from "@openhotel/pixi-components";

export const MODAL_NAVIGATOR_TAB_NAME_MAP: Record<ModalNavigatorTab, string> = {
  [ModalNavigatorTab.HOTEL]: "Hotel",
  [ModalNavigatorTab.ROOMS]: "Rooms",
  [ModalNavigatorTab.ME]: "Me",
  [ModalNavigatorTab.SEARCH]: "Search",
};

export const MODAL_HOT_BAR_ITEMS = {
  [Modal.CONSOLE]: {
    icon: "console-off",
  },
  [Modal.NAVIGATOR]: {
    icon: "navigator",
  },
  [Modal.CATALOG]: {
    icon: "catalog",
  },
  [Modal.INVENTORY]: {
    icon: "inventory",
  },
  [Modal.PURSE]: {
    icon: "purse",
  },
  [Modal.CLUB]: {
    icon: "club",
  },
};

export const MODAL_SIZE_MAP: Record<Modal, Size> = {
  [Modal.NAVIGATOR]: {
    width: 250,
    height: 260,
  },
};

export const MODAL_COMPONENT_MAP: Record<Modal, React.FC> = {
  [Modal.CONSOLE]: ConsoleComponent,
  [Modal.NAVIGATOR]: NavigatorComponent,
  [Modal.CATALOG]: CatalogComponent,
  [Modal.INVENTORY]: InventoryComponent,
  [Modal.PURSE]: PurseComponent,
  [Modal.CLUB]: ClubComponent,
};
