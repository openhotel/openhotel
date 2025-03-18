import { Modal } from "shared/enums";
import React from "react";

export const modals = () => {
  const modalsMap: Record<Modal, React.FC> = {} as Record<Modal, React.FC>;
  let modalsHideMap: Modal[] = [];

  const open = (modal: Modal, component: React.FC) => {
    if (modalsHideMap.includes(Number(modal))) {
      modalsHideMap = modalsHideMap.filter(
        ($modal) => $modal !== Number(modal),
      );
      return;
    }
    modalsMap[modal] = component;
  };

  const close = (modal: Modal) => {
    modalsHideMap.push(Number(modal));
  };

  const isOpen = (modal: Modal) => {
    return !modalsHideMap.includes(Number(modal)) && modalsMap[Number(modal)];
  };

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
