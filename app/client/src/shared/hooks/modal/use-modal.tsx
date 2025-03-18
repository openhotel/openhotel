import { useContext } from "react";
import { ModalContext, TemplateState } from "shared/hooks/modal/modal.context";

export const useModal = (): TemplateState => useContext(ModalContext);
