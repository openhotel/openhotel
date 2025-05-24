import * as React from "react";

// @ts-ignore
import styles from "./main-layout.module.scss";
import {
  FooterComponent,
  NavigatorComponent,
  SocialComponent,
  BackgroundComponent,
  CardComponent,
  MainComponent,
  LicenseComponent,
  HeaderComponent,
} from "../../../components";
import { cn } from "../../../utils";
import { LayoutProvider } from "../../../hooks";

type Props = {
  navigatorChildren?: React.ReactNode;
  headerChildren?: React.ReactNode;
  footerChildren?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const MainLayoutComponent: React.FC<Props> = ({
  children,
  navigatorChildren,
  headerChildren,
  footerChildren,
}) => {
  return (
    <LayoutProvider>
      <BackgroundComponent>
        <CardComponent className={styles.bigCard}>
          <div className={styles.container}>
            <NavigatorComponent children={navigatorChildren} />
            <div className={styles.bigContainer}>
              <HeaderComponent children={headerChildren} />
              <MainComponent
                className={cn(styles.main, {
                  [styles.headless]: !headerChildren,
                })}
                children={children}
              />
            </div>
          </div>
          <FooterComponent>
            <SocialComponent />
            {footerChildren}
            <LicenseComponent />
          </FooterComponent>
        </CardComponent>
      </BackgroundComponent>
    </LayoutProvider>
  );
};
