import React, { ReactNode, useCallback, useMemo } from "react";
import { useCamera, ModalContext } from "shared/hooks";
import {
  ContainerComponent,
  DragContainerComponent,
  EventMode,
  useWindow,
} from "@openhotel/pixi-components";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";
import { useModalStore } from "./modal.store";
import { MODAL_COMPONENT_MAP, MODAL_SIZE_MAP } from "shared/consts";

type ModalProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<ModalProps> = ({
  children,
}) => {
  const { getSize } = useWindow();
  const {
    modals,
    open,
    close,
    closeAll: $closeAll,
    get,
    setPosition,
    isOpen,
  } = useModalStore();

  const openModal = useCallback(
    (modal: Modal) => {
      if (modals[modal]?.visible) return;

      const modalSize = MODAL_SIZE_MAP[modal];
      const windowSize = getSize();

      open(modal, {
        x: windowSize.width / 2 - modalSize.width / 2,
        y: windowSize.height / 2 - modalSize.height / 2,
      });
    },
    [getSize, open, modals],
  );

  const closeModal = useCallback(
    (modal: Modal) => {
      close(modal);
    },
    [close],
  );

  const closeAll = useCallback(() => {
    $closeAll();
  }, [$closeAll]);
  const isModalOpen = useCallback((modal: Modal) => isOpen(modal), [isOpen]);

  const setModalPosition = useCallback(
    (modal: Modal, position: Point2d) => {
      setPosition(modal, position);
    },
    [setPosition],
  );

  const { setCanDrag } = useCamera();

  const disableCameraMovement = useCallback(() => {
    setCanDrag(false);
  }, [setCanDrag]);

  const enableCameraMovement = useCallback(() => {
    setCanDrag(true);
  }, [setCanDrag]);

  const renderModals = useMemo(() => {
    return Object.keys(modals)
      .map((modal: any) => {
        const { position, visible } = get(modal);
        const Modal = MODAL_COMPONENT_MAP[modal];
        return Modal ? (
          <DragContainerComponent
            key={modal}
            zIndex={100}
            children={<Modal />}
            position={position ?? { x: 0, y: 0 }}
            visible={visible}
            eventMode={EventMode.STATIC}
            onPointerDown={disableCameraMovement}
            onPointerUp={enableCameraMovement}
            onPointerLeave={enableCameraMovement}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [modals, get]);

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
