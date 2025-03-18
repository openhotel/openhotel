import React from "react";
import { Modal } from "shared/enums";

export type TemplateState = {
  openModal: (modalId: Modal, Content: React.FC) => void;
  closeModal: (modalId: Modal) => void;
  isModalOpen: (modalId: Modal) => boolean;
};

export const ModalContext = React.createContext<TemplateState>(undefined);
