import React, { ReactNode, useCallback, useMemo } from "react";
import { ModalContext } from "shared/hooks/modal/modal.context";
import {
  ContainerComponent,
  DragContainerComponent,
  useWindow,
} from "@oh/pixi-components";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";
import { useModalStore } from "./modal.store";
import { MODAL_COMPONENT_MAP, MODAL_SIZE_MAP } from "shared/consts";

type TemplateProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const { getSize } = useWindow();
  const store = useModalStore();

  const openModal = useCallback(
    (modal: Modal) => {
      if (store.modals[modal]?.visible) return;

      const modalSize = MODAL_SIZE_MAP[modal];
      const windowSize = getSize();

      store.open(modal, {
        x: windowSize.width / 2 - modalSize.width / 2,
        y: windowSize.height / 2 - modalSize.height / 2,
      });
    },
    [getSize],
  );

  const closeModal = useCallback((modal: Modal) => {
    store.close(modal);
  }, []);

  const closeAll = useCallback(() => {
    store.closeAll();
  }, []);
  const isModalOpen = useCallback((modal: Modal) => store.isOpen(modal), []);

  const setModalPosition = useCallback((modal: Modal, position: Point2d) => {
    store.setPosition(modal, position);
  }, []);

  const renderModals = useMemo(() => {
    return Object.keys(store.modals)
      .map((modal: any) => {
        const { position, visible } = store.get(modal);
        const Modal = MODAL_COMPONENT_MAP[modal];
        return Modal ? (
          <DragContainerComponent
            key={modal}
            zIndex={100}
            children={<Modal />}
            position={position ?? { x: 0, y: 0 }}
            visible={visible}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [store]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        setModalPosition,
        closeAll,
      }}
      children={
        <>
          {children}
          <ContainerComponent sortableChildren={true}>
            {renderModals}
          </ContainerComponent>
        </>
      }
    />
  );
};
