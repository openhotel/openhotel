import React, { ReactNode, useCallback, useMemo, useRef } from "react";
import { ModalContext } from "shared/hooks/modal/modal.context";
import {
  ContainerComponent,
  DragContainerComponent,
  useUpdate,
} from "@oh/pixi-components";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";

type TemplateProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const { update, lastUpdate } = useUpdate();

  const modalMapRef = useRef<
    Record<
      Modal,
      {
        component: React.FC;
        visible: boolean;
        position: Point2d;
      }
    >
  >({} as any);

  const openModal = useCallback(
    (modal: Modal, component: React.FC) => {
      if (modalMapRef.current[modal]) return closeModal(modal);

      modalMapRef.current[modal] = {
        component,
        visible: true,
        position: { x: 0, y: 0 },
      };
      update();
    },
    [update],
  );

  const closeModal = useCallback(
    (modal: Modal) => {
      modalMapRef.current[modal].visible = false;
      update();
    },
    [update],
  );

  const isModalOpen = useCallback(
    (modal: Modal) => Boolean(modalMapRef.current[modal]?.visible),
    [],
  );

  const setModalPosition = useCallback(
    (modal: Modal, position: Point2d) => {
      modalMapRef.current[modal].position = position;
      update();
    },
    [update],
  );

  const renderModals = useMemo(() => {
    return Object.keys(modalMapRef.current)
      .map((modal: any) => {
        const {
          component: Modal,
          position,
          visible,
        } = modalMapRef.current[modal];
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
  }, [lastUpdate]);

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
