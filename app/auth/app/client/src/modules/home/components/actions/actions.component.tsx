import React from "react";
import { LinkComponent } from "shared/components";

export const ActionsComponent = () => {
  return (
    <div>
      <h2>Actions</h2>
      <div>
        <LinkComponent to="/logout">
          <button>Logout</button>
        </LinkComponent>
      </div>
    </div>
  );
};
