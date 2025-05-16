import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ModalContext, useCamera } from "shared/hooks";
import {
  ContainerComponent,
  DragContainerComponent,
  Event,
  EventMode,
  useEvents,
  useUpdate,
  useWindow,
} from "@openhotel/pixi-components";
import { Modal } from "shared/enums";
import { Point2d } from "shared/types";
import { useModalStore } from "./modal.store";
import { MODAL_SIZE_MAP } from "shared/consts";
import {
  CatalogComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
  RoomCreatorComponent,
} from "modules/modals";

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
  const { on } = useEvents();
  const { lastUpdate, update } = useUpdate();

  const lastModalList = useRef<Modal[]>([]);
  const cursorOverModalRef = useRef<Modal | null>(null);
  const focusedModalRef = useRef<Modal | null>(null);

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

  useEffect(() => {
    const removeOnPointerDown = on(Event.POINTER_DOWN, () => {
      if (
        cursorOverModalRef.current === null ||
        focusedModalRef.current === cursorOverModalRef.current
      )
        return;
      focusedModalRef.current = cursorOverModalRef.current;
      update();
    });
    const removeOnPointerUp = on(Event.POINTER_UP, () => {
      enableCameraMovement();
    });

    return () => {
      removeOnPointerDown();
      removeOnPointerUp();
    };
  }, [modals, on, update, enableCameraMovement]);

  const onPointerEnter = useCallback(
    (modal: Modal) => () => {
      cursorOverModalRef.current = modal;
    },
    [],
  );

  const onPointerLeave = useCallback(
    (modal: Modal) => () => {
      enableCameraMovement();
      //only if last was this modal
      if (cursorOverModalRef.current === modal)
        cursorOverModalRef.current = null;
    },
    [enableCameraMovement],
  );

  const MODAL_COMPONENT_MAP: Record<Modal, React.FC> = useMemo(
    () => ({
      [Modal.CONSOLE]: ConsoleComponent,
      [Modal.NAVIGATOR]: NavigatorComponent,
      [Modal.CATALOG]: CatalogComponent,
      [Modal.INVENTORY]: InventoryComponent,
      [Modal.PURSE]: PurseComponent,
      [Modal.CLUB]: ClubComponent,
      [Modal.ROOM_CREATOR]: RoomCreatorComponent,
    }),
    [],
  );

  const renderModals = useMemo(() => {
    const targetModals = Object.keys(modals).map(
      (modalId) => parseInt(modalId) as Modal,
    );
    const visibleModals = targetModals.filter((modal) => get(modal).visible);
    const newModals = visibleModals.filter(
      (modal) => !lastModalList.current.includes(modal),
    );
    //save current modals to check if there's a new one
    //@ts-ignore
    lastModalList.current = visibleModals;
    return visibleModals
      .map((modal: Modal) => {
        const { position } = get(modal);
        const ModalComp = MODAL_COMPONENT_MAP[modal];
        const zIndex = newModals.includes(modal)
          ? 150
          : focusedModalRef.current === modal
            ? 100
            : 50;
        return ModalComp ? (
          <DragContainerComponent
            key={modal}
            zIndex={zIndex}
            maxZIndex={zIndex}
            minZIndex={zIndex}
            children={<ModalComp />}
            position={position ?? { x: 0, y: 0 }}
            eventMode={EventMode.STATIC}
            onPointerDown={disableCameraMovement}
            onPointerUp={enableCameraMovement}
            onPointerEnter={onPointerEnter(modal)}
            onPointerLeave={onPointerLeave(modal)}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [modals, get, enableCameraMovement, disableCameraMovement, lastUpdate]);

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
