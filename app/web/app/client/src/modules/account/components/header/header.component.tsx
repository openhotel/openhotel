import React from "react";
import { ButtonComponent } from "@openhotel/web-components";
import styles from "./header.module.scss";
import { useSession } from "shared/hooks";

export const HeaderComponent: React.FC = () => {
  const { login, logout, account } = useSession();

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
