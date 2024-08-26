import React from "react";
import styles from "./header.module.scss";
import { ContainerComponent, LinkComponent } from "shared/components";

export const HeaderComponent = () => {
  return (
    <header className={styles.header}>
      <ContainerComponent className={styles.container}>
        <span>Open Hotel Asset Editor</span>
        <div className={styles.items}>
          <LinkComponent to="/">Home</LinkComponent>
          <LinkComponent to="/file-manager">File Manager</LinkComponent>
          <LinkComponent to="/sprite-sheets">Sprite Sheets</LinkComponent>
          <LinkComponent to="/furniture">Furniture</LinkComponent>
          <LinkComponent to="/human-clothes">Human and Clothes</LinkComponent>
          <LinkComponent to="/public-rooms">Public Rooms</LinkComponent>
        </div>
      </ContainerComponent>
    </header>
  );
};
