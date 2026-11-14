import React from "react";
import { Outlet } from "react-router-dom";
import { ContentComponent, FooterComponent } from "modules/application";
import { HeaderComponent } from "../header";
//@ts-ignore
import styles from "./layout.module.scss";

export const LayoutComponent = () => {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <HeaderComponent />
        <ContentComponent>
          <Outlet />
        </ContentComponent>
        <FooterComponent />
      </div>
    </div>
  );
};
