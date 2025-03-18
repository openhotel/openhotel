import React from "react";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";

export type TemplateState = {
  openModal: (modalId: Modal, Content: React.FC) => void;
  closeModal: (modalId: Modal) => void;
  isModalOpen: (modalId: Modal) => boolean;
  setModalPosition: (modalId: Modal, position: Point2d) => void;
};

export const ModalContext = React.createContext<TemplateState>(undefined);
