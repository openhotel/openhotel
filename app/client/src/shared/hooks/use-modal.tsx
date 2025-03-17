import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Modal } from "shared/enums";
import {
  ContainerComponent,
  DragContainerComponent,
} from "@oh/pixi-components";

type ModalState = {
  openModal: (modalId: Modal, Content: React.FC) => void;
  closeModal: (modalId: Modal) => void;
};

const ModalContext = React.createContext<ModalState>(undefined);

type ModalProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<ModalProps> = ({
  children,
}) => {
  const [modalsMap, setModalMap] = useState<Record<Modal, React.FC>>({} as any);

  const openModal = useCallback(
    (modal: Modal, component: React.FC) => {
      setModalMap((data) => ({
        ...data,
        [modal]: component,
      }));
    },
    [setModalMap],
  );

  const closeModal = useCallback(
    (modal: Modal) => {
      setModalMap((map) => ({
        ...map,
        [modal]: null,
      }));
    },
    [setModalMap],
  );

  const renderModals = useMemo(() => {
    return Object.keys(modalsMap)
      .map((modal) => {
        const Modal = modalsMap[modal];
        return Modal ? (
          <DragContainerComponent
            key={modal}
            zIndex={100}
            children={<Modal />}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [modalsMap]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
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

export const useModal = (): ModalState => useContext(ModalContext);
