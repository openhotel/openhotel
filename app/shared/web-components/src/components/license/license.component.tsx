import * as React from "react";

// @ts-ignore
import styles from "./license.module.scss";
import {
  BYIconComponent,
  CCIconComponent,
  NCEUIconComponent,
  SAIconComponent,
} from "../index";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const LicenseComponent: React.FC<Props> = () => (
  <a
    href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
    target="_blank"
    className={styles.license}
    title="CC BY-NC-SA 4.0"
  >
    <CCIconComponent />
    <BYIconComponent />
    <NCEUIconComponent />
    <SAIconComponent />
  </a>
);
