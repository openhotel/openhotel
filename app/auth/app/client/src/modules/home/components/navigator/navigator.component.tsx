import React from "react";
import { useRedirect } from "shared/hooks";
import { HotelIconComponent, NavItemComponent } from "@oh/components";

export const HomeNavigatorComponent: React.FC = () => {
  const { navigate } = useRedirect();

  return (
    <>
      <NavItemComponent onClick={navigate} icon={<HotelIconComponent />}>
        Last Hotel
      </NavItemComponent>
    </>
  );
};
