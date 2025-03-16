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
import { ModalProps } from "shared/types";

export const MODAL_COMPONENTS_MAP: Record<Modal, React.FC<ModalProps>> = {
  [Modal.CONSOLE]: ConsoleComponent,
  [Modal.NAVIGATOR]: NavigatorComponent,
  [Modal.CATALOG]: CatalogComponent,
  [Modal.INVENTORY]: InventoryComponent,
  [Modal.PURSE]: PurseComponent,
  [Modal.CLUB]: ClubComponent,
};

export const MODAL_SPRITE_MAP: Record<Modal, string> = {
  [Modal.CONSOLE]: "console-off",
  [Modal.NAVIGATOR]: "navigator",
  [Modal.CATALOG]: "catalog",
  [Modal.INVENTORY]: "inventory",
  [Modal.PURSE]: "purse",
  [Modal.CLUB]: "club",
};

export const MODAL_NAVIGATOR_TAB_NAME_MAP: Record<ModalNavigatorTab, string> = {
  [ModalNavigatorTab.HOTEL]: "Hotel",
  [ModalNavigatorTab.ROOMS]: "Rooms",
  [ModalNavigatorTab.ME]: "Me",
  [ModalNavigatorTab.SEARCH]: "Search",
};
export const MODAL_NAVIGATOR_TAB_MAP: Record<ModalNavigatorTab, React.FC> = {
  [ModalNavigatorTab.HOTEL]: CategoryHotelComponent,
  [ModalNavigatorTab.ROOMS]: CategoryRoomsComponent,
  [ModalNavigatorTab.ME]: CategoryMeComponent,
  [ModalNavigatorTab.SEARCH]: CategorySearchComponent,
};
