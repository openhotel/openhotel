import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { ModalBackgroundComponent, ModalLayoutComponent } from "../components";
import { createRoot } from "react-dom/client";

type ModalState = {
  open: (props: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
  }) => void;
  close: () => void;
};

const ModalContext = React.createContext<ModalState>(undefined);

type ModalProps = {
  children: ReactNode;
};

export const ModalProvider: React.FunctionComponent<ModalProps> = ({
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>();

  const close = useCallback(() => {
    modalRef.current.remove();
    delete modalRef.current;
  }, [modalRef]);

  const open = useCallback(
    ({ children, className, style }) => {
      if (modalRef.current) close();

      const container = document.createElement("div");
      document.body.appendChild(container);
      modalRef.current = container;

      const root = createRoot(container); // For React 18+
      root.render(
        <ModalBackgroundComponent>
          <ModalLayoutComponent onClick={close}>
            {children}
          </ModalLayoutComponent>
        </ModalBackgroundComponent>,
      );
    },
    [close],
  );

  return (
    <ModalContext.Provider
      value={{
        open,
        close,
      }}
      children={children}
    />
  );
};

export const useModal = (): ModalState => useContext(ModalContext);
