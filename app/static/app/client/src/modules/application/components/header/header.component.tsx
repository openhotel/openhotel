import React from "react";
import styles from "./header.module.scss";
import { LinkComponent } from "shared/components";
import { useAppSession } from "shared/hooks";

export const HeaderComponent = () => {
  const { user } = useAppSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={"favicon.ico"} />
          <LinkComponent to="/">Open Hotel Statics</LinkComponent>
        </div>
        {user ? <div>{user?.username}</div> : null}
      </div>
    </header>
  );
};
