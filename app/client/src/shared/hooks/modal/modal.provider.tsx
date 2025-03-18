import React, { ReactNode, useCallback, useMemo } from "react";
import { ModalContext } from "shared/hooks/modal/modal.context";
import {
  ContainerComponent,
  DragContainerComponent,
  useUpdate,
} from "@oh/pixi-components";
import { Modal } from "shared/enums";
import { System } from "system";

type TemplateProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const { update, lastUpdate } = useUpdate();

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

  const renderModals = useMemo(() => {
    return Object.keys(System.modals.getAll())
      .map((modal) => {
        const Modal = System.modals.get(modal as any);
        return Modal ? (
          <DragContainerComponent
            key={modal}
            zIndex={100}
            children={<Modal />}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [lastUpdate]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
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
