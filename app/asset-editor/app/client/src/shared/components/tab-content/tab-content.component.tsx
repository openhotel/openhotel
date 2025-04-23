import React, { useState } from "react";
import { cn } from "shared/utils";
//@ts-ignore
import styles from "./tab-content.module.scss";
import {
  ChevronDownIconComponent,
  ChevronUpIconComponent,
} from "@openhotel/components";

type Props = {
  title: string;
  defaultShow?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const TabContentComponent: React.FC<Props> = ({
  className,
  title,
  defaultShow = false,
  children,
}) => {
  const [show, setShow] = useState<boolean>(defaultShow);

  return (
    <div className={cn(className, styles.tabContent)}>
      <div className={styles.header} onClick={() => setShow((show) => !show)}>
        <span>{title}</span>
        {show ? <ChevronUpIconComponent /> : <ChevronDownIconComponent />}
      </div>
      {show ? children : null}
    </div>
  );
};
