import React from "react";
import { ButtonComponent } from "@openhotel/web-components";

export const HomeComponent: React.FC = () => {
  return (
    <div>
      <h2>Home</h2>
      <label>
        {/*{account*/}
        {/*  ? `Welcome back ${account.username}!`*/}
        {/*  : "Welcome to OpenHotel!"}*/}
      </label>
      <p />
      <ButtonComponent
        color="yellow"
        variant="3d"
        onPointerDown={() =>
          window.location.replace("https://client.openhotel.club")
        }
      >
        Play!
      </ButtonComponent>
      <p />
    </div>
  );
};
