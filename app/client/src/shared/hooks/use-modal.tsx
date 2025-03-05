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
import { MODAL_COMPONENTS_MAP } from "shared/consts";

type ModalState = {
  toggleModal: (modal: Modal) => void;
};

const ModalContext = React.createContext<ModalState>(undefined);

type ModalProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<ModalProps> = ({
  children,
}) => {
  const [openedModals, setOpenedModals] = useState<Modal[]>([]);

  const toggleModal = useCallback((modal: Modal) => {
    setOpenedModals((modals) => {
      if (modals.includes(modal))
        return modals.filter(($modal) => modal !== $modal);
      return [...modals, modal];
    });
  }, []);

  const renderModals = useMemo(
    () =>
      openedModals.map((openModal) => {
        const Modal = MODAL_COMPONENTS_MAP[openModal];

        return (
          <DragContainerComponent
            key={openModal}
            zIndex={100}
            dragPolygon={[0, 0, 20, 0, 20, 20, 0, 20]}
          >
            <Modal />
          </DragContainerComponent>
        );
      }),
    [openedModals],
  );

  return (
    <ModalContext.Provider
      value={{
        toggleModal,
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
