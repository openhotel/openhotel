import React from "react";
import { useAppSession } from "shared/hooks";
import { ButtonComponent } from "@openhotel/web-components";
import styles from "./header.module.scss";

export const HeaderComponent: React.FC = () => {
  const { account, login, logout } = useAppSession();

  if (account === undefined) return;

  if (!account)
    return (
      <>
        <div />
        <ButtonComponent color="light" onPointerDown={login}>
          Login
        </ButtonComponent>
      </>
    );

  return (
    <>
      <div />
      <div className={styles.header}>
        <label className={styles.username}>{account.username}</label>
        <div onPointerDown={logout} className={styles.logout}>
          logout
        </div>
      </div>
    </>
  );
};
