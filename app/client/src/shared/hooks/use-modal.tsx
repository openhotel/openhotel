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
  Cursor,
  DragContainerComponent,
  EventMode,
  GraphicsComponent,
  GraphicType,
} from "@oh/pixi-components";
import { MODAL_COMPONENTS_MAP } from "shared/consts";
import { ModalData } from "shared/types";

type RenderModalProps = {
  modal: Modal;
  onClose: () => void;
};

const RenderModal: React.FC<RenderModalProps> = ({ modal, onClose }) => {
  const [data, setData] = useState<ModalData>(null);

  const Modal = useMemo(() => MODAL_COMPONENTS_MAP[modal], [modal]);

  return (
    <DragContainerComponent
      key={modal}
      zIndex={100}
      dragPolygon={data?.dragPolygon ?? []}
    >
      {data?.closeCircle ? (
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={data?.closeCircle?.radius ?? 0}
          alpha={0}
          cursor={Cursor.POINTER}
          eventMode={EventMode.STATIC}
          position={data?.closeCircle?.position}
          zIndex={100}
          onPointerDown={onClose}
        />
      ) : null}
      <Modal setModalData={setData} onClose={onClose} />
    </DragContainerComponent>
  );
};

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
      openedModals.map((modal) => (
        <RenderModal
          key={modal}
          modal={modal}
          onClose={() => toggleModal(modal)}
        />
      )),
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
