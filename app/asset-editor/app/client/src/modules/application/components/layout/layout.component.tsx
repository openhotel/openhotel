import React from "react";
import { Outlet } from "react-router-dom";
import { ContentComponent, FooterComponent } from "modules/application";
import { HeaderComponent } from "../header";
import { BackgroundComponent } from "@oh/components";
//@ts-ignore
import styles from "./layout.module.scss";

export const LayoutComponent = () => {
  return (
    <BackgroundComponent className={styles.background}>
      <div className={styles.wrapper}>
        <HeaderComponent />
        <ContentComponent>
          <Outlet />
        </ContentComponent>
        <FooterComponent />
      </div>
    </BackgroundComponent>
  );
};
