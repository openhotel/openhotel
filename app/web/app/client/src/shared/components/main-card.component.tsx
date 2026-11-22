import React from "react";
import { LogoComponent } from "shared/components/logo.component.tsx";
import { Props } from "shared/types/react.types.ts";

export const MainCardComponent: React.FC<Props> = ({ children }) => {
  return (
    <div className="border">
      <div
        className={`flex bg-(--hero) overflow-hidden ${children ? "border-b" : null}`}
      >
        <LogoComponent />
      </div>
      {children ? (
        <div className="bg-(--box) p-card flex gap-4">{children}</div>
      ) : null}
    </div>
  );
};
