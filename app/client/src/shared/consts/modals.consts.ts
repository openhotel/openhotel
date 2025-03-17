import { Modal, ModalNavigatorTab } from "shared/enums";
import React from "react";
import {
  CatalogComponent,
  CategoryHotelComponent,
  CategoryMeComponent,
  CategoryRoomsComponent,
  CategorySearchComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
} from "modules/modals";
import { ModalNavigatorTabProps } from "shared/types";

export const MODAL_NAVIGATOR_TAB_NAME_MAP: Record<ModalNavigatorTab, string> = {
  [ModalNavigatorTab.HOTEL]: "Hotel",
  [ModalNavigatorTab.ROOMS]: "Rooms",
  [ModalNavigatorTab.ME]: "Me",
  [ModalNavigatorTab.SEARCH]: "Search",
};
export const MODAL_NAVIGATOR_TAB_MAP: Record<
  ModalNavigatorTab,
  React.FC<ModalNavigatorTabProps>
> = {
  [ModalNavigatorTab.HOTEL]: CategoryHotelComponent,
  [ModalNavigatorTab.ROOMS]: CategoryRoomsComponent,
  [ModalNavigatorTab.ME]: CategoryMeComponent,
  [ModalNavigatorTab.SEARCH]: CategorySearchComponent,
};

export const MODAL_HOT_BAR_ITEMS = {
  [Modal.CONSOLE]: {
    icon: "console-off",
    component: ConsoleComponent,
  },
  [Modal.NAVIGATOR]: {
    icon: "navigator",
    component: NavigatorComponent,
  },
  [Modal.CATALOG]: {
    icon: "catalog",
    component: CatalogComponent,
  },
  [Modal.INVENTORY]: {
    icon: "navigator",
    component: InventoryComponent,
  },
  [Modal.PURSE]: {
    icon: "purse",
    component: PurseComponent,
  },
  [Modal.CLUB]: {
    icon: "club",
    component: ClubComponent,
  },
};
