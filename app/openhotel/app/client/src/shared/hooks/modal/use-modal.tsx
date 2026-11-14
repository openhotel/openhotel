import { useContext } from "react";
import { ModalContext, ModalState } from "shared/hooks/modal/modal.context";

export const useModal = (): ModalState => useContext(ModalContext);
