import React from "react";
import { MainCardComponent } from "shared/components/main-card.component.tsx";
import { NavBarComponent } from "shared/components/nav-bar.component.tsx";

export const HomeComponent: React.FC = () => {
  return (
    <div>
      <MainCardComponent>
        <NavBarComponent
          items={[
            {
              key: "home",
              label: "Home",
            },
            {
              key: "news",
              label: "News",
            },
            {
              key: "news",
              label: "News",
              disabled: true,
            },
          ]}
          selectedItem="home"
        />
      </MainCardComponent>
    </div>
  );
};
