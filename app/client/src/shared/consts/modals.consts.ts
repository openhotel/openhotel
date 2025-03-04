import { Modal } from "shared/enums";
import React from "react";
import {
  CatalogComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
} from "modules/modals";

export const MODAL_COMPONENTS_MAP: Record<Modal, React.FC> = {
  [Modal.CONSOLE]: ConsoleComponent,
  [Modal.NAVIGATOR]: NavigatorComponent,
  [Modal.CATALOG]: CatalogComponent,
  [Modal.INVENTORY]: InventoryComponent,
  [Modal.PURSE]: PurseComponent,
  [Modal.CLUB]: ClubComponent,
};

export const MODAL_SPRITE_MAP: Record<Modal, string> = {
  [Modal.CONSOLE]: "console",
  [Modal.NAVIGATOR]: "navigator",
  [Modal.CATALOG]: "catalog",
  [Modal.INVENTORY]: "box",
  [Modal.PURSE]: "purse",
  [Modal.CLUB]: "club",
};
