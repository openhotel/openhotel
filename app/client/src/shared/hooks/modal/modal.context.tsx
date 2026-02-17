import React from "react";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";

export type ModalState = {
  openModal: <T = unknown>(modalId: Modal, data?: T) => void;
  closeModal: (modalId: Modal) => void;
  closeAll: () => void;
  isModalOpen: (modalId: Modal) => boolean;
  setModalPosition: (modalId: Modal, position: Point2d) => void;
  getModalData: <T = unknown>(modalId: Modal) => T | undefined;
};

export const ModalContext = React.createContext<ModalState>(undefined);
