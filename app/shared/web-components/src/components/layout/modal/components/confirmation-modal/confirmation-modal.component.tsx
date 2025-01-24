import React from "react";
import {
  ButtonComponent,
  CrossIconComponent,
  ModalComponent,
} from "../../../../../components";

//@ts-ignore
import styles from "./confirmation-modal.module.scss";

type Props = {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmationModalComponent: React.FC<Props> = ({
  title,
  description,
  onConfirm = () => {},
  onClose = () => {},
  cancelText = "Cancel",
  confirmText = "Ok",
}) => {
  return (
    <ModalComponent className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <CrossIconComponent className={styles.icon} onClick={onClose} />
      </div>
      <div className={styles.description}>{description}</div>
      <div className={styles.actions}>
        <ButtonComponent onClick={onClose}>{cancelText}</ButtonComponent>
        <ButtonComponent
          color="grey"
          onClick={() => {
            onClose?.();
            onConfirm?.();
          }}
        >
          {confirmText}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};
