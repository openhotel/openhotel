import React, { useEffect, useState } from "react";
import styles from "./footer.module.scss";

export const FooterComponent = () => {
  const [version, setVersion] = useState<string>(null);

  useEffect(() => {
    fetch("/api/version")
      .then((response) => response.json())
      .then(({ data }) => setVersion(data.version));
  }, [setVersion]);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <label>{version}</label>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en"
          target="_blank"
        >
          <img
            alt="by-nc-sa"
            src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg"
          />
        </a>
      </div>
    </footer>
  );
};
