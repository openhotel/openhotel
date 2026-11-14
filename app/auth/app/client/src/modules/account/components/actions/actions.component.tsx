import React from "react";
import { LinkComponent } from "shared/components";
import { ButtonComponent } from "@openhotel/web-components";

export const ActionsComponent = () => {
  return (
    <div>
      <h2>Actions</h2>
      <div>
        <LinkComponent to="/logout">
          <ButtonComponent>Logout</ButtonComponent>
        </LinkComponent>
      </div>
    </div>
  );
};
