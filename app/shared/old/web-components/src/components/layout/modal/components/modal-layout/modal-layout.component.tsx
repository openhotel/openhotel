import React, { useCallback, useRef } from "react";
//@ts-ignore
import styles from "./modal-layout.module.scss";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const ModalLayoutComponent: React.FC<Props> = ({
  children,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const $onClick = useCallback((event) => {
    if (ref.current === event.target) onClick();
  }, []);

  return (
    <div ref={ref} className={styles.layout} onClick={$onClick}>
      {children}
    </div>
  );
};
