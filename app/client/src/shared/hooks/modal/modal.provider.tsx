import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { ModalContext } from "shared/hooks/modal/modal.context";
import {
  ContainerComponent,
  DragContainerComponent,
  useUpdate,
} from "@oh/pixi-components";
import { Modal } from "shared/enums";
import { System } from "system";
import { Point2d } from "shared/types";

type TemplateProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const { update, lastUpdate } = useUpdate();
  const [modalMapPosition, setModalMapPosition] = useState<
    Record<Modal, Point2d>
  >({} as Record<Modal, Point2d>);

  const openModal = useCallback(
    (modal: Modal, component: React.FC) => {
      update();
      System.modals.open(modal, component);
    },
    [update],
  );

  const closeModal = useCallback(
    (modal: Modal) => {
      update();
      System.modals.close(modal);
    },
    [update],
  );

  const isModalOpen = useCallback(
    (modal: Modal) => System.modals.isOpen(modal),
    [],
  );

  const setModalPosition = useCallback(
    (modalId: Modal, position: Point2d) => {
      setModalMapPosition((modalMap) => ({
        ...modalMap,
        [modalId]: position,
      }));
    },
    [setModalMapPosition],
  );

  const renderModals = useMemo(() => {
    return Object.keys(System.modals.getAll())
      .map((modal: any) => {
        const Modal = System.modals.get(modal);
        return Modal ? (
          <DragContainerComponent
            key={modal}
            zIndex={100}
            children={<Modal />}
            position={modalMapPosition[modal] ?? { x: 0, y: 0 }}
            visible={System.modals.isOpen(modal)}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [lastUpdate, modalMapPosition]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        setModalPosition,
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
