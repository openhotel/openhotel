import React, { useEffect } from "react";
import { MainCardComponent } from "shared/components/main-card.component.tsx";
import { NavBarComponent } from "shared/components/nav-bar.component.tsx";
import { useNavigate } from "react-router";
import { SETUP_PATH } from "shared/consts/setup.consts.ts";

export const HomeComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(SETUP_PATH);
  }, []);

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
