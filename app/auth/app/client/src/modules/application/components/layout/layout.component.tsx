import React from "react";
import { Outlet } from "react-router-dom";
import { ContentComponent, FooterComponent } from "modules/application";
import { HeaderComponent } from "../header";
import styles from "./layout.module.scss";

export const LayoutComponent = () => {
  return (
    <>
      <HeaderComponent />
      <ContentComponent>
        <div className={styles.outlet}>
          <Outlet />
        </div>
        <FooterComponent />
      </ContentComponent>
    </>
  );
};
