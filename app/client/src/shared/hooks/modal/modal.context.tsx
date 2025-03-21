import React from "react";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";

export type ModalState = {
  openModal: (modalId: Modal) => void;
  closeModal: (modalId: Modal) => void;
  closeAll: () => void;
  isModalOpen: (modalId: Modal) => boolean;
  setModalPosition: (modalId: Modal, position: Point2d) => void;
};

export const ModalContext = React.createContext<ModalState>(undefined);
