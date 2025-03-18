import { Modal } from "shared/enums";
import React from "react";

export const modals = () => {
  const modalsMap: Record<Modal, React.FC> = {} as Record<Modal, React.FC>;

  const open = (modal: Modal, component: React.FC) => {
    modalsMap[modal] = component;
  };

  const close = (modal: Modal) => {
    delete modalsMap[modal];
  };

  const isOpen = (modal: Modal) => Boolean(!isNaN(modalsMap[modal] as any));

  const getAll = () => modalsMap;
  const get = (modalId: Modal) => modalsMap[modalId];

  return {
    open,
    close,
    isOpen,

    getAll,
    get,
  };
};
