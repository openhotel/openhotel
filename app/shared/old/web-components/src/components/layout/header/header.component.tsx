import * as React from "react";

// @ts-ignore
import styles from "./header.module.scss";
import { useLayout } from "../../../hooks";
import { useCallback } from "react";
import { BurgerArrowIconComponent, BurgerIconComponent } from "../../icons";

type Props = {
  children?: React.ReactNode;
};

export const HeaderComponent: React.FC<Props> = ({ children }) => {
  const { toggleNavigator, openNavigator } = useLayout();

  const onClickBurger = useCallback(() => {
    toggleNavigator();
  }, [toggleNavigator]);

  return (
    <header className={styles.header}>
      <div className={styles.burger} onClick={onClickBurger}>
        {openNavigator ? <BurgerArrowIconComponent /> : <BurgerIconComponent />}
      </div>
      {children}
    </header>
  );
};
