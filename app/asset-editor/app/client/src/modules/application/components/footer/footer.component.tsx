import React from "react";
import styles from "./footer.module.scss";
import { ContainerComponent } from "shared/components";

export const FooterComponent = () => {
  return (
    <footer className={styles.footer}>
      <ContainerComponent className={styles.container}>
        <label>Open Hotel</label>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en"
          target="_blank"
        >
          <img
            alt="by-nc-sa"
            src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg"
          />
        </a>
      </ContainerComponent>
    </footer>
  );
};
